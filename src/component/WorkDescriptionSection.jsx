import React, { useRef, useCallback, useMemo } from 'react';
import { FaTrash, FaPlusCircle, FaPaperclip } from 'react-icons/fa';
import { BsInputCursor } from "react-icons/bs";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const WorkDescriptionSection = ({
    workDescription,
    setWorkDescription,
    customInputFields,
    setCustomInputFields,
    attachments,
    setAttachments,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    location,
    setLocation
}) => {

    const quillRef = useRef(null);

    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            try {
                const file = input.files[0];
                if (!file) return;

                const imageUrl = URL.createObjectURL(file);
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();
                quill.insertEmbed(range ? range.index : quill.getLength(), 'image', imageUrl);
            } catch (error) {
                console.error("Error in imageHandler:", error);
            }
        };
    }, []);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        },
    }), [imageHandler]);

    const formats = useMemo(() => ([
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image',
        'clean'
    ]), []);

    const handleAddCustomField = () => {
        setCustomInputFields(prev => [...prev, { id: Date.now(), value: '' }]);
    };

    const handleCustomFieldValueChange = (fieldId, newValue) => {
        setCustomInputFields(prev => prev.map(f => f.id === fieldId ? { ...f, value: newValue } : f));
    };

    const handleDeleteCustomField = (fieldId) => {
        setCustomInputFields(prev => prev.filter(f => f.id !== fieldId));
    };

    const handleAddAttachment = () => {
        setAttachments(prev => [...prev, { id: Date.now(), name: '' }]);
    };

    const handleAttachmentNameChange = (attachmentId, newName) => {
        setAttachments(prev => prev.map(a => a.id === attachmentId ? { ...a, name: newName } : a));
    };

    const handleDeleteAttachment = (attachmentId) => {
        setAttachments(prev => prev.filter(a => a.id !== attachmentId));
    };

    return (
        <div className="space-y-4">
            <div className='mb-12'>
                <label className="text-md font-semibold text-slate-700 mb-2 block">Work Instruction</label>
                <ReactQuill 
                    ref={quillRef} 
                    theme="snow" 
                    value={workDescription} 
                    onChange={setWorkDescription} 
                    className="bg-white rounded-md h-[120px] " 
                    placeholder="Enter work description..." 
                    modules={modules} 
                    formats={formats} 
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-26">
                <div>
                    <label className="text-md font-semibold text-slate-700 mb-2 block">Start Time</label>
                    <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="text-md font-semibold text-slate-700 mb-2 block">End Time</label>
                    <input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>
            </div>

            <div className="mt-4">
                <label className="text-md font-semibold text-slate-700 mb-2 block">Location</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter location"
                />
            </div>

            <div className="flex items-center space-x-4 pt-4 border-t mt-4">
                <button type="button" onClick={handleAddCustomField} className="flex items-center text-xs font-medium text-blue-600"><BsInputCursor className="mr-1"/> Add Input Field</button>
                <button type="button" onClick={handleAddAttachment} className="flex items-center text-xs font-medium text-blue-600"><FaPaperclip className="mr-1"/> Add Attachment</button>
            </div>

            <div className="space-y-2">
                <h6 className="text-sm font-semibold text-slate-600">Custom Fields:</h6>
                {customInputFields.map(field => (
                    <div key={field.id} className="flex items-center space-x-2">
                        <input type="text" value={field.value} onChange={e => handleCustomFieldValueChange(field.id, e.target.value)} className="w-full px-3 py-1 border border-gray-300 rounded-md" placeholder="Enter label..." />
                        <button type="button" onClick={() => handleDeleteCustomField(field.id)} className="text-red-500 p-1"><FaTrash size={14} /></button>
                    </div>
                ))}
                {customInputFields.length === 0 && <p className="text-xs text-slate-500">No custom fields added.</p>}
            </div>
            <div className="space-y-2">
                <h6 className="text-sm font-semibold text-slate-600">Attachments:</h6>
                {attachments.map(attachment => (
                    <div key={attachment.id} className="flex items-center space-x-2">
                        <input type="text" value={attachment.name} onChange={e => handleAttachmentNameChange(attachment.id, e.target.value)} className="w-full px-3 py-1 border border-gray-300 rounded-md" placeholder="Enter attachment name..." />
                        <button type="button" onClick={() => handleDeleteAttachment(attachment.id)} className="text-red-500 p-1"><FaTrash size={14} /></button>
                    </div>
                ))}
                {attachments.length === 0 && <p className="text-xs text-slate-500">No attachments added.</p>}
            </div>
        </div>
    );
};

export default WorkDescriptionSection;
