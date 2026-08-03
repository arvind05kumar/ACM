import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, FileCheck } from 'lucide-react';
import { CONFIG } from '../config/config';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Toast } from './ui/Toast';
import { useDeviceDetails } from '../hooks/useDeviceDetails';
import { validateForm } from '../utils/validation';
import { loadMasterStudentList, verifyStudent } from '../services/verificationService';

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
      const endpoint = CONFIG.googleSheetEndpoint || CONFIG.googleAppsScriptUrl;
      if (!endpoint || endpoint.trim() === '') {
        showToast("Google Sheet endpoint is not configured! Please add your Sheet URL in src/config/config.js", "error");
        setIsLoading(false);
        return;
      }

      // 1. Pre-submission verification against Master Student List
      let verification = { status: 'Unverified', remarks: 'Verification Pending' };
      try {
        const masterList = await loadMasterStudentList(CONFIG.masterStudentListUrl);
        verification = verifyStudent(formData, masterList);
      } catch (vErr) {
        console.warn("Could not load master list for verification:", vErr);
        verification = { status: 'Unverified', remarks: 'Master List Unavailable' };
      }

      const timestamp = new Date().toLocaleString();

      // Assemble full payload (user inputs + friendly headers + device meta + verification)
      const payload = {
        fullName: formData.fullName,
        rollNumber: formData.rollNumber,
        mobile: formData.mobile,
        college: formData.college,
        course: formData.course,
        section: formData.section,
        semester: formData.semester,
        timestamp: timestamp,
        browser: deviceMeta.browser || '',
        operatingSystem: deviceMeta.operatingSystem || '',
        device: deviceMeta.device || '',
        status: verification.status,
        remarks: verification.remarks,
        Status: verification.status,
        Remarks: verification.remarks,
        // Column header name fallbacks for SheetDB / SheetMonkey / Google Sheets
        "Full Name": formData.fullName,
        "Roll Number": formData.rollNumber,
        "Mobile Number": formData.mobile,
        "College": formData.college,
        "Course": formData.course,
        "Section": formData.section,
        "Semester": formData.semester,
        "Timestamp": timestamp,
        "Status": verification.status,
        "Remarks": verification.remarks,
        "status": verification.status,
        "remarks": verification.remarks
      };

      const isSheetDB = endpoint.includes('sheetdb.io');
      const requestBody = isSheetDB
        ? JSON.stringify({ data: [payload] })
        : JSON.stringify(payload);

      // Set options for POST
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: requestBody
      });

      const responseText = await response.text();
      let result = {};
      try {
        result = JSON.parse(responseText);
      } catch (e) {}

      if (response.ok || response.status === 201 || result.created === 1) {
        onFormSuccess(payload);
      } else {
        if (result.status === 'duplicate') {
          showToast(result.message || "You have already marked your attendance.", "error");
        } else {
          const errorMsg = result.error || result.message || "Failed to record response in Google Sheet.";
          showToast(errorMsg, "error");
        }
      }

    } catch (err) {
      console.error('Submission Error:', err);
      showToast("Server connection error. Please check your Google Sheet API Endpoint URL in src/config/config.js", "error");
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
                {[1, 3, 5, 7].map((sem) => (
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
