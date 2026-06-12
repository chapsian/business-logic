import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, RefreshCw, AlertCircle, Eye, Sliders, ShieldCheck } from 'lucide-react';
import { AnalyzedDocument, User } from '../types';

interface DocumentAnalyzerProps {
  user: User;
  onUpgrade: () => void;
}

export default function DocumentAnalyzer({ user, onUpgrade }: DocumentAnalyzerProps) {
  const [documents, setDocuments] = useState<AnalyzedDocument[]>([
    {
      id: 'doc-template-1',
      fileName: 'Nairobi_Waters_Invoice_May.png',
      fileSize: '430 KB',
      uploadDate: '12th Jun 2026',
      status: 'completed',
      extractedData: {
        merchantName: 'Nairobi City Water & Sewerage Co.',
        invoiceDate: '2026-05-24',
        totalAmount: 'KSh 8,720.00',
        vatAmount: 'KSh 1,202.75 (16%)',
        category: 'Utilities / Water Charges',
        summary: 'Monthly compound water usage invoice for company site premises.',
        confidenceScore: 0.98,
        auditAdvice: 'Eligible for Input tax offset since Nairobi Water is registered for VAT. Declare in Line 1A of monthly VAT return.'
      }
    }
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeDocId, setActiveDocId] = useState<string | null>('doc-template-1');
  const [errorText, setErrorText] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Convert file helper
  const processFile = async (file: File) => {
    setErrorText(null);
    
    // Check size limit (e.g. 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setErrorText("File size exceeds 8MB limit. Please upload a smaller document.");
      return;
    }

    // Limit free tier to 1 document upload
    if (!user.isPremium && documents.length >= 2) {
      setErrorText("Upgrade to Premium Plan to upload and analyze unlimited business documents.");
      onUpgrade();
      return;
    }

    const tempDocId = 'doc-' + Date.now();
    const newDoc: AnalyzedDocument = {
      id: tempDocId,
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(0) + ' KB',
      uploadDate: 'Today',
      status: 'processing'
    };

    setDocuments(prev => [newDoc, ...prev]);
    setActiveDocId(tempDocId);
    setIsProcessing(true);

    try {
      const reader = new FileReader();
      
      // Read file as base64 string
      const fileDataPromise = new Promise<string>((resolve) => {
        reader.onload = (event) => {
          if (event.target?.result) {
            const base64 = (event.target.result as string).split(',')[1];
            resolve(base64);
          }
        };
        reader.readAsDataURL(file);
      });

      const base64Data = await fileDataPromise;
      
      const response = await fetch('/api/gemini/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type || 'image/png',
          base64: base64Data
        })
      });

      if (!response.ok) {
        throw new Error('Analysis request failed on server');
      }

      const resData = await response.json();
      
      if (resData.success && resData.extracted) {
        setDocuments(prev => prev.map(d => {
          if (d.id === tempDocId) {
            return {
              ...d,
              status: 'completed',
              extractedData: resData.extracted
            };
          }
          return d;
        }));
      } else {
        throw new Error(resData.error || 'Invalid analysis response format');
      }

    } catch (err: any) {
      console.error(err);
      setDocuments(prev => prev.map(d => {
        if (d.id === tempDocId) {
          return {
            ...d,
            status: 'failed',
            extractedData: {
              summary: 'We failed to identify the file structures securely. Ensure the image is highly legibile and contains explicit receipts items.'
            }
          };
        }
        return d;
      }));
      setErrorText(`Failed to analyze: ${file.name}. Ensure it is a valid receipt image or document.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUsePreset = (name: string, size: string, merchant: string, amount: string, vat: string, cat: string, summary: string, tip: string) => {
    setErrorText(null);
    const newId = 'doc-preset-' + Date.now();
    const newDoc: AnalyzedDocument = {
      id: newId,
      fileName: name,
      fileSize: size,
      uploadDate: 'Today (Preset)',
      status: 'completed',
      extractedData: {
        merchantName: merchant,
        invoiceDate: '2026-06-10',
        totalAmount: amount,
        vatAmount: vat,
        category: cat,
        summary: summary,
        confidenceScore: 0.99,
        auditAdvice: tip
      }
    };
    setDocuments(prev => [newDoc, ...prev]);
    setActiveDocId(newId);
  };

  const activeDoc = documents.find(d => d.id === activeDocId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-6" id="document-analyzer-root">
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-white text-lg flex items-center">
            AI Automated Bookkeeping & Receipt Analysis
            <span className="ml-2.5 text-[10px] px-2 py-0.5 bg-indigo-500/15 text-indigo-400 font-mono rounded-full border border-indigo-500/30 font-bold uppercase tracking-wider">
              OCR
            </span>
          </h3>
          <p className="text-slate-400 text-xs mt-1">Upload business expense receipts to extract ledgers, calculate statutory margins, and prepare books.</p>
        </div>
        {!user.isPremium && (
          <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full font-mono font-medium h-fit">
            LIMIT: 1 DOC
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Upload Column */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* File Drag Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition ${
              isDragging 
                ? 'border-indigo-500 bg-indigo-500/5' 
                : 'border-slate-800 bg-slate-950/40 hover:bg-slate-950/80 hover:border-slate-700'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              className="hidden" 
              accept="image/*,application/pdf"
            />
            <div className="p-3 bg-slate-900/80 rounded-xl text-indigo-400 border border-slate-800 mb-3">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-200">Drag & Drop receipt or invoice</p>
            <p className="text-xs text-slate-500 mt-1">Accepts PNG, JPG, JPEG (Max 8MB)</p>
            <button className="mt-4 text-xs font-mono font-bold text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-lg transition">
              Select Document File
            </button>
          </div>

          {errorText && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-2.5 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorText}</span>
            </div>
          )}

          {/* Preset Buttons for Demo */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2.5">Or try standard Kenyan expense presets:</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleUsePreset(
                  'Safaricom_Internet_Invoice.png', '1.2 MB', 
                  'Safaricom PLC', 'KSh 15,000.00', 'KSh 2,068.96 (16% VAT)', 
                  'Communication / Business Internet', 
                  'Monthly fiber internet bill for office bandwidth.',
                  'Internet packages are 100% tax-deductible for corporate income tax declarations. Claim KSh 2,068.96 Input VAT in safety.'
                )}
                className="w-full text-left text-xs bg-slate-900 hover:bg-slate-850 text-slate-350 p-2.5 rounded-lg border border-slate-800 transition flex items-center justify-between"
              >
                <span className="flex items-center"><FileText className="h-3.5 w-3.5 mr-2 text-emerald-400" /> Safaricom Office Internet Invoice</span>
                <span className="font-mono text-[10px] text-slate-500 font-bold">KSh 15,000</span>
              </button>
              
              <button
                type="button"
                onClick={() => handleUsePreset(
                  'KPLC_Prepaid_Token_Receipt.png', '890 KB', 
                  'Kenya Power & Lighting Co.', 'KSh 4,500.00', 'KSh 620.69 (16% VAT)', 
                  'Utilities / PowerTokens', 
                  'Electricity prepaid fuel-cost inclusive token transaction slip.',
                  'Input VAT claimable. Ensure prepaid token tax invoice is downloaded from iTax using KPLC PIN P051096537M.'
                )}
                className="w-full text-left text-xs bg-slate-900 hover:bg-slate-850 text-slate-350 p-2.5 rounded-lg border border-slate-800 transition flex items-center justify-between"
              >
                <span className="flex items-center"><FileText className="h-3.5 w-3.5 mr-2 text-yellow-500" /> Kenya Power prepaid token receipt</span>
                <span className="font-mono text-[10px] text-slate-500 font-bold">KSh 4,500</span>
              </button>
            </div>
          </div>

          {/* Queue List */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-500">Document Upload Queue ({documents.length})</p>
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setActiveDocId(doc.id)}
                className={`flex items-center justify-between p-3 rounded-lg border transition cursor-pointer text-xs ${
                  doc.id === activeDocId
                    ? 'bg-slate-950 border-indigo-500 text-white'
                    : 'bg-slate-950/20 border-slate-800 text-slate-400 hover:bg-slate-950/60'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className={`p-1.5 rounded-md ${
                    doc.status === 'processing' ? 'bg-indigo-500/20 text-indigo-400 animate-spin' :
                    doc.status === 'completed' ? 'bg-emerald-500/20 text-emerald-450' : 
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {doc.status === 'processing' ? <RefreshCw className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-slate-200 truncate">{doc.fileName}</p>
                    <p className="font-mono text-[10px] text-slate-500 mt-0.5">{doc.fileSize} &middot; {doc.uploadDate}</p>
                  </div>
                </div>
                <div>
                  {doc.status === 'completed' && <span className="h-2 w-2 rounded-full bg-emerald-500 block" />}
                  {doc.status === 'processing' && <span className="h-2 w-2 rounded-full bg-indigo-500 block animate-ping" />}
                  {doc.status === 'failed' && <span className="h-2 w-2 rounded-full bg-red-500 block" />}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Extracted Data Display Column */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between min-h-[400px]">
          {activeDoc ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-slate-800/60 pb-3">
                <div>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono px-2 py-0.5 rounded-full font-bold">ANALYZED SCHEMAS</span>
                  <h4 className="font-semibold text-slate-200 text-sm mt-1.5 font-mono truncate max-w-[320px]">{activeDoc.fileName}</h4>
                </div>
                {activeDoc.status === 'completed' && activeDoc.extractedData?.confidenceScore && (
                  <span className="text-xs text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-lg font-mono border border-emerald-500/10">
                    Confidence: {(activeDoc.extractedData.confidenceScore * 100).toFixed(0)}%
                  </span>
                )}
              </div>

              {activeDoc.status === 'processing' && (
                <div className="py-16 text-center space-y-3">
                  <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-slate-300">Extracting Transaction Data with Gemini AI...</p>
                  <p className="text-xs text-slate-500 max-w-[280px] mx-auto">Parsing invoice numbers, merchant names, tax brackets, and compliance structures matching KRA iTax rules.</p>
                </div>
              )}

              {activeDoc.status === 'failed' && (
                <div className="py-12 text-center text-red-400 space-y-2">
                  <AlertCircle className="h-7 w-7 mx-auto" />
                  <p className="text-sm font-semibold">Parser Limit Reached or Internal Error</p>
                  <p className="text-xs text-slate-500 max-w-[280px] mx-auto">
                    Let's upgrade to the Premium plan for heavy scans or use preset bills to test compliance workflows immediately.
                  </p>
                </div>
              )}

              {activeDoc.status === 'completed' && activeDoc.extractedData && (
                <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                  <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-lg">
                    <p className="text-slate-500 font-mono uppercase text-[9px] tracking-wider">Merchant / Invoice Entity</p>
                    <p className="text-slate-200 font-semibold text-sm mt-1">{activeDoc.extractedData.merchantName || 'Unknown Merchant'}</p>
                  </div>
                  
                  <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-lg">
                    <p className="text-slate-500 font-mono uppercase text-[9px] tracking-wider">Tax Registration Category</p>
                    <p className="text-slate-205 text-slate-200 font-semibold text-sm mt-1">{activeDoc.extractedData.category || 'Uncategorized'}</p>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-lg">
                    <p className="text-slate-500 font-mono uppercase text-[9px] tracking-wider">Gross Total Amount</p>
                    <p className="text-indigo-400 text-sm font-mono mt-1 font-bold">{activeDoc.extractedData.totalAmount || 'Unknown'}</p>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-lg">
                    <p className="text-slate-500 font-mono uppercase text-[9px] tracking-wider">KRA VAT Component</p>
                    <p className="text-slate-350 text-slate-200 text-sm font-mono mt-1 font-semibold">{activeDoc.extractedData.vatAmount || 'Non-VATable/Zero Rated'}</p>
                  </div>

                  <div className="col-span-2 bg-slate-900/30 p-3 rounded-lg border border-slate-850">
                    <p className="text-slate-500 font-mono uppercase text-[9px] tracking-wider">AI Extracted Summary</p>
                    <p className="text-slate-300 mt-1 leading-relaxed text-xs">{activeDoc.extractedData.summary || 'No overview available for this file format.'}</p>
                  </div>

                  <div className="col-span-2 bg-indigo-500/5 border border-indigo-550/20 p-3.5 rounded-lg flex items-start space-x-2.5">
                    <Sliders className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-indigo-200 font-mono text-[10px] uppercase font-bold tracking-wider">Bookkeeper KRA Compliance Advice</p>
                      <p className="text-indigo-300 mt-1 leading-relaxed text-[11px] font-sans">{activeDoc.extractedData.auditAdvice || 'No bookkeeping rules triggered. Keep receipt locked for audits.'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-24 text-center text-slate-500 space-y-2">
              <FileText className="h-8 w-8 mx-auto text-slate-750" />
              <p className="text-sm font-mono">No document selected</p>
              <p className="text-xs">Drag and drop receipts or choose a template preset above.</p>
            </div>
          )}

          <div className="border-t border-slate-800/60 pt-4 mt-6 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span className="flex items-center"><ShieldCheck className="h-3.5 w-3.5 text-indigo-400 mr-1.5" /> Data isolated with regulatory-grade sandbox standards</span>
            <span>KRA XML/JPEG V2</span>
          </div>
        </div>

      </div>

    </div>
  );
}
