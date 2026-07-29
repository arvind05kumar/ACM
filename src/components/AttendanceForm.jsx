import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, FileCheck, HelpCircle, Smartphone } from 'lucide-react';
import { CONFIG } from '../config/config';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Toast } from './ui/Toast';
import { useDeviceDetails } from '../hooks/useDeviceDetails';
import { validateForm } from '../utils/validation';

/**
 * Premium glassmorphic Attendance Registration Form.
 */
export function AttendanceForm({ onFormSuccess }) {
  // 1. Retrieve automated client metadata
  const deviceMeta = useDeviceDetails();

  // 2. Form field states
  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: '',
    college: '',
    course: '',
    section: '',
    semester: '',
    mobile: ''
  });

  // Inline errors state
  const [errors, setErrors] = useState({});
  
  // Loader and Notification alert states
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'info'
  });

  // Handle text entries
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear inline error warning on typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Trigger Toast helper
  const showToast = (message, type = 'info') => {
    setToast({
      visible: true,
      message,
      type
    });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast("Please correct the highlighted errors.", "error");
      return;
    }

    setIsLoading(true);

    try {
      // Assemble full payload (user inputs + hidden device info)
      const payload = {
        ...formData,
        ...deviceMeta,
        action: 'submitAttendance' // action header for Apps Script routing
      };

      // Set options for POST
      const response = await fetch(CONFIG.googleAppsScriptUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8' // Standard CORS-friendly Apps Script header
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Connection failed. Please check network logs.');
      }

      const result = await response.json();

      if (result.status === 'duplicate') {
        showToast(result.message || "You have already marked your attendance.", "error");
      } else if (result.status === 'success') {
        onFormSuccess(result.data || formData);
      } else {
        throw new Error(result.message || 'Verification rejected by Sheet compiler.');
      }

    } catch (err) {
      console.error('Submission Error:', err);
      // For local testing: if Google Apps script is not yet configured, show instructions.
      if (CONFIG.googleAppsScriptUrl.includes('your_script_id_here')) {
        showToast("Apps Script URL is not configured. Setup Google Sheet using our Integration Guide!", "error");
      } else {
        showToast("Server connection error. Please try again.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-8 select-none">
      
      {/* Toast Notification Container */}
      <Toast
        isVisible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />

      <div className="text-center max-w-md mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/30 border border-blue-900/50 text-[10px] font-heading font-extrabold uppercase text-primary-blue tracking-widest mb-3">
          <FileCheck className="h-3.5 w-3.5" />
          Attendance Ledger
        </div>
        <h2 className="text-3xl font-heading font-extrabold text-white tracking-tight">
          Mark Your Attendance
        </h2>
        <p className="text-sm font-sans font-medium text-gray-400 mt-2">
          Submit official attendance records directly into the ACM secure directory database.
        </p>
      </div>

      <Card hoverEffect={false} className="border border-gray-800/40 shadow-xl max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Name"
            required={true}
            error={errors.fullName}
            disabled={isLoading}
          />

          {/* Row 2: Roll Number & Mobile Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Roll Number"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="Enter Roll Number"
              required={true}
              error={errors.rollNumber}
              disabled={isLoading}
            />

            <Input
              label="Mobile Number"
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="9876543210"
              required={true}
              error={errors.mobile}
              disabled={isLoading}
            />
          </div>

          {/* Row 3: College & Course */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* College Dropdown Wrapper */}
            <div className="flex flex-col gap-1.5 w-full text-left">
              <label className="text-xs font-heading font-semibold text-gray-400 uppercase tracking-wider pl-1">
                College <span className="text-red-500">*</span>
              </label>
              <select
                name="college"
                value={formData.college}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-gray-950/40 backdrop-blur-xs border rounded-xl text-gray-200 font-sans text-sm tracking-wide transition-all duration-300 focus:outline-none focus:bg-gray-900/85
                  ${errors.college ? 'border-red-400 focus:border-red-500' : 'border-gray-800 focus:border-primary-blue'}`}
              >
                <option value="" className="bg-gray-950 text-gray-400">Select College</option>
                {["CEC", "COE", "CCT", "CBSA", "CCP", "HMCT"].map((coll) => (
                  <option key={coll} value={coll} className="bg-gray-950 text-gray-200">
                    {coll}
                  </option>
                ))}
              </select>
              {errors.college && (
                <span className="text-xs text-red-500 font-semibold pl-1">
                  {errors.college}
                </span>
              )}
            </div>

            <Input
              label="Course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="e.g. B.Tech CSE"
              required={true}
              error={errors.course}
              disabled={isLoading}
            />
          </div>

          {/* Row 4: Section & Semester */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              placeholder="e.g. CSE-A"
              required={true}
              error={errors.section}
              disabled={isLoading}
            />

            {/* Semester Dropdown Wrapper */}
            <div className="flex flex-col gap-1.5 w-full text-left">
              <label className="text-xs font-heading font-semibold text-gray-400 uppercase tracking-wider pl-1">
                Semester <span className="text-red-500">*</span>
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-gray-950/40 backdrop-blur-xs border rounded-xl text-gray-200 font-sans text-sm tracking-wide transition-all duration-300 focus:outline-none focus:bg-gray-900/85
                  ${errors.semester ? 'border-red-400 focus:border-red-500' : 'border-gray-800 focus:border-primary-blue'}`}
              >
                <option value="" className="bg-gray-950 text-gray-400">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem} className="bg-gray-950 text-gray-200">
                    Semester {sem}
                  </option>
                ))}
              </select>
              {errors.semester && (
                <span className="text-xs text-red-500 font-semibold pl-1">
                  {errors.semester}
                </span>
              )}
            </div>
          </div>

          {/* Extra Info: Note on security and privacy */}
          <div className="pt-2 text-left">
            <div className="rounded-xl bg-blue-950/20 border border-blue-900/30 p-4 flex gap-3 text-xs text-gray-400 leading-relaxed font-sans font-medium">
              <HelpCircle className="h-5 w-5 text-primary-blue shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-300">Security Note:</span> To prevent duplicate submissions, roll numbers are compiled in real-time. Operating system version <span className="font-semibold text-gray-300">({deviceMeta.operatingSystem})</span>, browser version <span className="font-semibold text-gray-300">({deviceMeta.browser})</span>, and submission timestamp are logged securely.
              </div>
            </div>
          </div>

          {/* Submission Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              iconRight={Send}
              className="w-full py-4 text-sm uppercase tracking-widest font-extrabold rounded-xl"
            >
              Verify & Register Attendance
            </Button>
          </div>

        </form>
      </Card>
    </section>
  );
}
