import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  useTheme,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const STEP = {
  UPLOAD: 0,
  SIGN: 1,
  COMPLETE: 2,
};

function MobileUploadApp() {
  const [pdfFile, setPdfFile] = useState(null);
  const [signedPdfUrl, setSignedPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(STEP.UPLOAD);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(""); // unsigned file preview

  const theme = useTheme();

  // Handle uploading PDF, show preview, set step to SIGN
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file.");
        return;
      }
      setPdfFile(file);
      setSignedPdfUrl("");
      setCurrentStep(STEP.SIGN);
      setPdfPreviewUrl(URL.createObjectURL(file)); // create preview URL
    }
  };

  const mockSignPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    pdfDoc.registerFontkit(fontkit);
    const fontBytes = await fetch("/OpenSans-Regular.ttf").then((res) =>
      res.arrayBuffer()
    );
    const customFont = await pdfDoc.embedFont(fontBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width } = firstPage.getSize();
    firstPage.drawText("Signed PDF", {
      x: width - 140,
      y: 30,
      size: 24,
      font: customFont,
      color: rgb(0, 0.53, 0.71),
    });

    const pdfBytes = await pdfDoc.save();
    const signedBlob = new Blob([pdfBytes], { type: "application/pdf" });
    return URL.createObjectURL(signedBlob);
  };

  const handleSignPdf = async () => {
    if (!pdfFile) {
      alert("Please upload a PDF file first.");
      return;
    }
    setLoading(true);
    try {
      const signedUrl = await mockSignPdf(pdfFile);
      setSignedPdfUrl(signedUrl);
      setCurrentStep(STEP.COMPLETE);
    } catch (err) {
      console.error("PDF signing error:", err);
      alert("Failed to sign PDF. Check console for error details.");
    } finally {
      setLoading(false);
    }
  };

  const icons = [
    {
      label: "Upload",
      icon: CloudUploadIcon,
    },
    {
      label: "Sign",
      icon: EditNoteIcon,
    },
    {
      label: "Complete",
      icon: CheckCircleIcon,
    },
  ];

  const stepColors = {
    active: "#0cbfd4",
    inactive: "#e7ecf2",
    complete: "#22c55e",
  };

  const getStepColor = (stepIdx) => {
    if (stepIdx < currentStep) return stepColors.complete;
    if (stepIdx === currentStep) return stepColors.active;
    return stepColors.inactive;
  };
  const iconColor = (stepIdx) =>
    stepIdx < currentStep || stepIdx === currentStep ? "#fff" : "#b0b6bc";

  const previewHeight = `calc(min(65vh, 380px))`;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f9fbfd",
        py: { xs: 2, md: 6 },
        px: 2,
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: { xs: 2, md: 4 } }}>
        <Typography variant="h3" fontWeight={900} color="primary">
          PDF Signer
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
          Securely upload and digitally sign your PDF documents instantly
        </Typography>
      </Box>

      {/* Custom Progress Bar */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 670,
          mx: "auto",
          display: "flex",
          alignItems: "center",
          mt: 3,
          mb: 4,
        }}
      >
        {icons.map((step, idx) => (
          <React.Fragment key={step.label}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 90,
              }}
            >
              <Box
                sx={{
                  bgcolor: getStepColor(idx),
                  color: iconColor(idx),
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    idx === currentStep
                      ? "0 2px 12px rgba(12,191,212,0.15)"
                      : undefined,
                  transition: "all 0.18s",
                }}
              >
                {React.createElement(step.icon, { fontSize: "medium" })}
              </Box>
              <Typography
                sx={{
                  mt: 1,
                  fontWeight: idx === currentStep ? 700 : 400,
                  color: idx === currentStep ? "#222e4a" : "#6c757d",
                  fontSize: "1.04rem",
                }}
              >
                {step.label}
              </Typography>
            </Box>
            {idx < 2 && (
              <Box
                sx={{
                  flex: 1,
                  height: 2,
                  bgcolor: "#e7ecf2",
                  mx: { xs: 1, sm: 2 },
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Box>

      {/* Centered Upload/Sign/Preview Card */}
      <Paper
        elevation={3}
        sx={{
          maxWidth: 440,
          mx: "auto",
          py: 4,
          px: { xs: 2, md: 5 },
          mt: 2,
          mb: 4,
          borderRadius: 5,
          border: "1.5px dashed #dde3ee",
          bgcolor: "#fff",
          minHeight: "260px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {/* Upload PDF step */}
        {!pdfFile && currentStep === STEP.UPLOAD && (
          <>
            <CloudUploadIcon
              sx={{ fontSize: 54, color: "primary.main", mb: 1 }}
            />
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              Upload PDF Document
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 2, color: "text.secondary" }}
            >
              Drag &amp; drop or click to browse
            </Typography>
            <Button
              variant="contained"
              component="label"
              size="large"
              disableElevation
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: 3,
                fontWeight: 700,
                bgcolor: "primary.main",
                color: "#fff",
                fontSize: "1rem",
              }}
              startIcon={<CloudUploadIcon />}
            >
              Choose File
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </>
        )}

        {/* Sign step: show file details, unsigned preview, and sign button */}
        {pdfFile && currentStep === STEP.SIGN && (
          <>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}
            >
              {pdfFile.name}
            </Typography>
            <Box
              sx={{
                width: "100%",
                maxWidth: 380,
                mx: "auto",
                mb: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f8fafc",
                borderRadius: 4,
                boxShadow: "0 4px 8px rgba(17,31,58,0.10)",
              }}
            >
              <iframe
                src={pdfPreviewUrl}
                title="pdf-preview"
                style={{
                  width: "100%",
                  height: previewHeight,
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "4px",
                }}
              />
            </Box>
            <Button
              variant="contained"
              color="success"
              size="large"
              fullWidth
              disabled={loading}
              onClick={handleSignPdf}
              sx={{
                py: 1.3,
                borderRadius: 3,
                fontWeight: 700,
                fontSize: "1.05rem",
                bgcolor: "success.main",
              }}
              startIcon={<CheckCircleIcon />}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Sign PDF"}
            </Button>
          </>
        )}

        {/* Complete step: show signed preview */}
        {pdfFile && signedPdfUrl && currentStep === STEP.COMPLETE && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              color="primary"
              sx={{ mb: 1 }}
            >
              {pdfFile.name}
            </Typography>
            <Box
              sx={{
                width: "100%",
                maxWidth: 380,
                mx: "auto",
                mt: 1,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <iframe
                src={signedPdfUrl}
                title="signed-pdf"
                style={{
                  width: "100%",
                  height: previewHeight,
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "4px",
                }}
              />
            </Box>
          </Box>
        )}
        {loading && (
          <Box sx={{ mt: 2 }}>
            <CircularProgress color="success" />
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default MobileUploadApp;
