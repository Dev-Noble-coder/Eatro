"use client";
import React, { useRef, useState } from "react";
import { X, Upload, Check, Copy, Share2 } from "lucide-react";

const AgentDetailsModal = ({
  isOpen,
  onClose,
  agent,
  onPaymentConfirmed,
}) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);


  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        setUploadedFile({
          name: file.name,
          size: (file.size / 1024).toFixed(2), // Convert to KB
        });
        setIsUploading(false);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }, 1500);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleShare = async () => {
    const shareText = `Bank Transfer Details:\n\nBank: ${agent.bankName}\nAccount Name: ${agent.accountName}\nAccount Number: ${agent.accountNumber}${agent.bankCode ? `\nBank Code: ${agent.bankCode}` : ""}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Eatro Payment Details",
          text: shareText,
        });
      } catch (err) {
        console.log("Share cancelled or failed:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText);
      setCopiedField("share");
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50 transition-all duration-300">
      {/* Modal Container */}
      <div className="w-full bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Agent Details Section */}
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              Agent Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Agent Name:</span>
                <span className="font-medium text-gray-900">
                  {agent.firstName} {agent.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone Number:</span>
                <span className="font-medium text-gray-900">{agent.phone}</span>
              </div>
            </div>
          </div>

          {/* Bank Details Section */}
          <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                Bank Details
              </h3>
              <button
                onClick={handleShare}
                className="p-1.5 hover:bg-green-200 rounded-full transition text-green-700"
                title="Share payment details"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="bg-white rounded-lg p-3">
                <p className="text-gray-600 text-xs mb-1">Bank Name</p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">
                    {agent.bankName}
                  </p>
                  <button
                    onClick={() => handleCopy(agent.bankName, "bankName")}
                    className={`p-1 rounded transition ${
                      copiedField === "bankName"
                        ? "bg-green-100 text-green-600"
                        : "hover:bg-gray-100 text-gray-400"
                    }`}
                    title="Copy bank name"
                  >
                    {copiedField === "bankName" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-gray-600 text-xs mb-1">Account Name</p>
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-semibold text-gray-900 text-sm line-clamp-2">
                      {agent.accountName}
                    </p>
                    <button
                      onClick={() =>
                        handleCopy(agent.accountName, "accountName")
                      }
                      className={`p-1 rounded flex-shrink-0 transition ${
                        copiedField === "accountName"
                          ? "bg-green-100 text-green-600"
                          : "hover:bg-gray-100 text-gray-400"
                      }`}
                      title="Copy account name"
                    >
                      {copiedField === "accountName" ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-gray-600 text-xs mb-1">Account Number</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono font-bold text-gray-900">
                      {agent.accountNumber}
                    </p>
                    <button
                      onClick={() =>
                        handleCopy(agent.accountNumber, "accountNumber")
                      }
                      className={`p-1 rounded transition ${
                        copiedField === "accountNumber"
                          ? "bg-green-100 text-green-600"
                          : "hover:bg-gray-100 text-gray-400"
                      }`}
                      title="Copy account number"
                    >
                      {copiedField === "accountNumber" ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {/* <div className="bg-white rounded-lg p-3">
                <p className="text-gray-600 text-xs mb-1">Bank Code</p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">
                    {agent.bankCode}
                  </p>
                  <button
                    onClick={() => handleCopy(agent.bankCode, "bankCode")}
                    className={`p-1 rounded transition ${
                      copiedField === "bankCode"
                        ? "bg-green-100 text-green-600"
                        : "hover:bg-gray-100 text-gray-400"
                    }`}
                    title="Copy bank code"
                  >
                    {copiedField === "bankCode" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div> */}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <p className="text-sm text-amber-900 leading-relaxed">
              Please make a bank transfer using the details above. Once
              completed, upload your proof of payment below.
            </p>
          </div>

          {/* File Upload Section */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">
              Upload Proof of Payment
            </h3>

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
                    onClick={handleRemoveFile}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {uploadSuccess && (
                  <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg text-sm font-medium">
                    ✓ File uploaded successfully!
                  </div>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full text-sm text-blue-600 font-medium py-2 hover:text-blue-700 transition"
                >
                  Upload Different File
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 hover:bg-white transition disabled:opacity-50"
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {isUploading ? "Uploading..." : "Click to upload proof"}
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, PDF (Max 5MB)</p>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Bottom Spacing */}
          <div className="h-6"></div>
        </div>

        {/* Action Button */}
        <div className="sticky bottom-0 bg-white border-t p-4">
          <button
            disabled={!uploadedFile || isProcessing}
            className="w-full bg-blue-700 text-white py-3 rounded-full font-semibold hover:bg-blue-800 transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={() => {
              setIsProcessing(true);
              setTimeout(() => {
                setIsProcessing(false);
                if (onPaymentConfirmed) {
                  onPaymentConfirmed();
                }
                onClose();
              }, 2000);
            }}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Payment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailsModal;
