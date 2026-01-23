"use client";

import { useState, useRef } from "react";
import { Upload, Check, AlertCircle, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const AgentOnboarding = () => {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Form states
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profileImage: "",

    // Student Information
    matricNumber: "",
    level: "100",
    gender: "",
    hostel: "Hostel A",

    // Bank Information
    bankName: "",
    accountNumber: "",
    accountName: "",
    bankCode: "",

    // Terms
    agreedToTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setError("");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedFile({
          name: file.name,
          size: Math.round(file.size / 1024),
          data: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateStep = (stepNum) => {
    const errors = [];

    if (stepNum === 1) {
      if (!formData.firstName.trim()) errors.push("First name is required");
      if (!formData.lastName.trim()) errors.push("Last name is required");
      if (!formData.email.trim()) errors.push("Email is required");
      if (!formData.phone.trim()) errors.push("Phone number is required");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.push("Invalid email format");
      }
    }

    if (stepNum === 2) {
      if (!formData.matricNumber.trim())
        errors.push("Matric number is required");
      if (!formData.level) errors.push("Level is required");
      if (!formData.gender) errors.push("Gender is required");
      if (!formData.hostel) errors.push("Hostel is required");
    }

    if (stepNum === 3) {
      if (!formData.bankName.trim()) errors.push("Bank name is required");
      if (!formData.accountNumber.trim())
        errors.push("Account number is required");
      if (!/^\d{10}$/.test(formData.accountNumber)) {
        errors.push("Account number must be 10 digits");
      }
      if (!formData.accountName.trim()) errors.push("Account name is required");
      if (!formData.bankCode.trim()) errors.push("Bank code is required");
    }

    if (stepNum === 4) {
      if (!formData.agreedToTerms) errors.push("You must agree to the terms");
    }

    if (errors.length > 0) {
      setError(errors[0]);
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      setError("");
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 5) {
      if (!uploadedFile) {
        setError("Please upload proof of payment");
        return;
      }

      if (!validateStep(4)) return;

      // Final submission
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/admin/agents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            proofOfPayment: uploadedFile?.data,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to register student");
          setIsSubmitting(false);
          return;
        }

        setSuccess("Student registered successfully!");
        setTimeout(() => {
          router.push("/admin/agents");
        }, 1000);
      } catch (err) {
        setError(err.message || "An error occurred");
        setIsSubmitting(false);
      }
    } else {
      if (validateStep(step)) {
        setStep(step + 1);
        setError("");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Student Registration
          </h1>
          <p className="text-gray-600">Step {step} of 5</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            {((step / 5) * 100).toFixed(0)}% Complete
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-400"
                      placeholder="John"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-400"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-400"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-400"
                    placeholder="+234 800 000 0000"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Student Information */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Student Information
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Matric Number
                  </label>
                  <input
                    type="text"
                    name="matricNumber"
                    value={formData.matricNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-400 text-black"
                    placeholder="e.g., 2021/001234"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-400 text-gray-700"
                      required
                    >
                      <option value="100" className="placeholder-gray-400">
                        100 Level
                      </option>
                      <option value="200">200 Level</option>
                      <option value="300">300 Level</option>
                      <option value="400">400 Level</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-700"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hostel
                  </label>
                  <select
                    name="hostel"
                    value={formData.hostel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-700"
                    required
                  >
                    <option value="Hostel A">Hostel A</option>
                    <option value="Hostel B">Hostel B</option>
                    <option value="Hostel C">Hostel C</option>
                    <option value="Hostel D">Hostel D</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Bank Information */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Bank Details
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-400 text-black"
                    placeholder="e.g., Zenith Bank"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Name
                    </label>
                    <input
                      type="text"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-400 text-black"
                      placeholder="Your bank account name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-400 text-black"
                      placeholder="10 digits"
                      maxLength="10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Code
                  </label>
                  <input
                    type="text"
                    name="bankCode"
                    value={formData.bankCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-400 text-black"
                    placeholder="e.g., 057"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 4: Terms & Conditions */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Terms & Conditions
                </h2>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-64 overflow-y-auto mb-6">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    By registering as a student user, you agree to:
                    <br />
                    <br />
                    1. Provide accurate and complete information during
                    registration
                    <br />
                    2. Maintain the confidentiality of your account credentials
                    <br />
                    3. Use the platform in accordance with all applicable laws
                    and regulations
                    <br />
                    4. Not engage in any fraudulent or deceptive practices
                    <br />
                    5. Respect the intellectual property rights of others
                    <br />
                    6. Accept responsibility for all activities under your
                    account
                    <br />
                    <br />
                    The platform reserves the right to suspend or terminate
                    accounts that violate these terms.
                  </p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <span className="text-sm text-gray-700">
                    I have read and agree to the terms and conditions above
                  </span>
                </label>
              </div>
            )}

            {/* Step 5: Proof of Payment */}
            {step === 5 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  ID proof
                </h2>

                <p className="text-gray-600 mb-4">
                  Please upload a clear picture of yourself to complete
                  your onboarding.
                </p>

                {uploadedFile ? (
                  <div className="space-y-3">
                    <div className="bg-white rounded-xl p-4 flex items-center justify-between border-2 border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Check className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {uploadedFile.size} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        ✕
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full text-sm text-blue-600 font-medium py-2 hover:text-blue-700 transition"
                    >
                      Upload Different File
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 hover:bg-gray-50 transition"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Click to upload proof
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF (Max 5MB)
                    </p>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                  Your ID will be verified by our admin team before
                  your account is activated.
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Previous
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 font-semibold rounded-lg transition flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : step === 5 ? (
                  <>
                    Complete Registration
                    <Check className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-8">
          Need help? Contact support at support@eatro.com
        </p>
      </div>
    </div>
  );
};

export default AgentOnboarding;
