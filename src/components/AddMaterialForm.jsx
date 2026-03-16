import React, { useState, useEffect } from 'react';

/**
 * Add Material Form Component
 * Form to add educational materials when creating a new subject
 * Supports multiple file types: PDF, PowerPoint, Word, Text, etc.
 */
const AddMaterialForm = ({ onAddMaterial }) => {
  const [material, setMaterial] = useState({
    title: '',
    content: '',
    type: 'text',
    lessonNumber: 1,
    fileName: '',
    fileSize: 0,
    fileType: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Initialize PDF.js worker
  useEffect(() => {
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
  }, []);

  const handleSubmit = () => {
    console.log('Add Lesson clicked with material:', material);
    
    if (!material.title.trim()) {
      alert('Please enter a lesson title');
      return;
    }

    if (!material.content.trim()) {
      alert('Please add lesson content or upload a file');
      return;
    }

    try {
      // Call parent function to add material
      console.log('Calling onAddMaterial with:', material);
      onAddMaterial(material);
      
      // Reset form but keep incremented lesson number
      const nextLessonNumber = material.lessonNumber + 1;
      setMaterial({
        title: '',
        content: '',
        type: 'text',
        lessonNumber: nextLessonNumber,
        fileName: '',
        fileSize: 0,
        fileType: ''
      });

      alert('Lesson added successfully!');
    } catch (error) {
      console.error('Error adding material:', error);
      alert('Failed to add lesson. Please try again.');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size too large. Please choose a file smaller than 10MB.');
        return;
      }

      const fileName = file.name;
      const fileSize = file.size;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      
      // Set material type to file when uploading
      const materialType = 'file';

      // Show loading state
      setIsLoading(true);
      setMaterial(prev => ({
        ...prev,
        content: 'Loading file...',
        title: prev.title || fileName.replace(/\.[^/.]+$/, ""),
        type: materialType,
        fileName: fileName,
        fileSize: fileSize
      }));

      try {
        let content = '';

        if (['txt', 'md'].includes(fileExtension)) {
          // Read text files
          content = await readTextFile(file);
        } else if (fileExtension === 'pdf') {
          // Read PDF files
          content = await readPDFFile(file);
        } else {
          // For other files (Word, PowerPoint), store as reference
          content = `File uploaded: ${fileName} (${(fileSize / 1024 / 1024).toFixed(2)} MB)\n\nNote: This ${fileExtension.toUpperCase()} file has been uploaded as reference. For AI exam generation, please extract the text content and paste it in the text area, or convert to PDF format.`;
        }

        setMaterial(prev => ({
          ...prev,
          content: content,
          title: prev.title || fileName.replace(/\.[^/.]+$/, ""),
          type: 'file', // Always keep as 'file' type
          fileName: fileName,
          fileSize: fileSize,
          fileType: fileExtension // Store actual file type separately
        }));

      } catch (error) {
        console.error('Error reading file:', error);
        alert(`Failed to read ${fileExtension.toUpperCase()} file. Please try again or use a text file.`);
        setMaterial(prev => ({
          ...prev,
          content: '',
          fileName: '',
          fileSize: 0,
          fileType: ''
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Helper function to read text files
  const readTextFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
    });
  };

  // Helper function to read PDF files
  const readPDFFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          
          // Use PDF.js to extract text
          if (window.pdfjsLib) {
            const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items.map(item => item.str).join(' ');
              fullText += pageText + '\n\n';
            }
            
            if (fullText.trim()) {
              resolve(fullText.trim());
            } else {
              resolve(`PDF file uploaded: ${file.name}\n\nNote: Could not extract text from this PDF. The file may contain images or be password protected. Please copy and paste the text content manually.`);
            }
          } else {
            // Fallback if PDF.js is not available
            resolve(`PDF file uploaded: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)\n\nNote: PDF text extraction is not available. Please copy and paste the text content manually for AI exam generation.`);
          }
        } catch (error) {
          console.error('PDF parsing error:', error);
          resolve(`PDF file uploaded: ${file.name}\n\nNote: Could not extract text from this PDF. Please copy and paste the text content manually.`);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return '📄';
      case 'ppt':
      case 'pptx': return '📊';
      case 'doc':
      case 'docx': return '📝';
      case 'txt':
      case 'md': return '📃';
      default: return '📁';
    }
  };

  const getSupportedFormats = () => {
    return '.pdf,.ppt,.pptx,.doc,.docx,.txt,.md';
  };

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
      <h4 className="font-semibold mb-3 text-gray-800 dark:text-white">Add Study Material</h4>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Lesson Title *
            </label>
            <input
              type="text"
              value={material.title}
              onChange={(e) => setMaterial(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Introduction to Algebra"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Lesson Number *
            </label>
            <input
              type="number"
              value={material.lessonNumber}
              onChange={(e) => setMaterial(prev => ({ ...prev, lessonNumber: parseInt(e.target.value) }))}
              min="1"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Material Type
          </label>
          <select
            value={material.type}
            onChange={(e) => {
              // If changing away from file type, clear file data
              if (e.target.value !== 'file' && material.fileName) {
                setMaterial(prev => ({ 
                  ...prev, 
                  type: e.target.value,
                  fileName: '',
                  fileSize: 0,
                  fileType: '',
                  content: ''
                }));
              } else {
                setMaterial(prev => ({ ...prev, type: e.target.value }));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="text">Text Content</option>
            <option value="file">Upload File</option>
            <option value="link">External Link</option>
          </select>
          {material.fileName && (
            <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
              📎 File selected: {material.fileName}
            </p>
          )}
        </div>

        {material.type === 'text' && (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Lesson Content *
            </label>
            <textarea
              value={material.content}
              onChange={(e) => setMaterial(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your lesson content here..."
              rows="4"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>
        )}

        {material.type === 'file' && (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Upload File *
            </label>
            <input
              type="file"
              accept={getSupportedFormats()}
              onChange={handleFileUpload}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm disabled:opacity-50"
            />
            {isLoading && (
              <div className="mt-2 flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-sm">Processing file...</span>
              </div>
            )}
            <div className="mt-2 text-xs text-gray-500">
              <p>Supported formats:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded">📄 PDF (text extraction)</span>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">📊 PowerPoint (reference)</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">📝 Word (reference)</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">📃 Text (full support)</span>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                ✅ PDF and Text files: Content will be extracted for AI exam generation<br/>
                ⚠️ Word/PowerPoint files: Stored as reference only
              </p>
            </div>
            {material.content && material.fileName && (
              <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/30 rounded border text-sm">
                <p className="text-green-800 dark:text-green-200 flex items-center gap-2 mb-2">
                  {getFileTypeIcon(material.fileType)} 
                  ✅ File uploaded: {material.fileName} 
                  ({(material.fileSize / 1024 / 1024).toFixed(2)} MB)
                </p>
                {material.fileType === 'pdf' && material.content.includes('PDF file uploaded:') && (
                  <p className="text-orange-600 dark:text-orange-400 text-xs">
                    ⚠️ Could not extract text from PDF. Please copy and paste content manually for AI exam generation.
                  </p>
                )}
                {material.fileType === 'pdf' && !material.content.includes('PDF file uploaded:') && (
                  <p className="text-green-600 dark:text-green-400 text-xs">
                    ✅ PDF text extracted successfully! Ready for AI exam generation.
                  </p>
                )}
                {['ppt', 'pptx', 'doc', 'docx'].includes(material.fileType) && (
                  <p className="text-blue-600 dark:text-blue-400 text-xs">
                    ℹ️ File stored as reference. For AI exams, please extract text content manually.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {material.type === 'link' && (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Material Link *
            </label>
            <input
              type="url"
              value={material.content}
              onChange={(e) => setMaterial(prev => ({ ...prev, content: e.target.value }))}
              placeholder="https://example.com/lesson"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
          >
            Add Lesson
          </button>
          <button
            type="button"
            onClick={() => setMaterial({ 
              title: '', 
              content: '', 
              type: 'text', 
              lessonNumber: 1, 
              fileName: '', 
              fileSize: 0,
              fileType: ''
            })}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition text-sm"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMaterialForm;