import { Appbar } from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";

// Import all necessary icons
import { SparklesIcon, DocumentTextIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { SparklesIcon as SolidSparklesIcon, ArrowUpOnSquareIcon } from "@heroicons/react/24/solid";
import { Spinner } from "../components/Spinner";

// --- Helper Types and Components ---

type ImproveInstruction = "Proofread" | "Make Professional" | "Summarize";

// 1. Helper Component: AI Suggestion Modal
const AiSuggestionModal = ({ isOpen, isLoading, suggestion, onClose, onReplace, onCopy }: any) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-4">AI Suggestion</h2>
                <div className="flex-grow bg-gray-50 border rounded-lg p-4 overflow-y-auto mb-4 prose">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full"><Spinner /></div>
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: suggestion }} />
                    )}
                </div>
                <div className="flex justify-end gap-3 flex-wrap">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">Close</button>
                    <button onClick={onCopy} disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold">Copy Text</button>
                    <button onClick={onReplace} disabled={isLoading} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold">Replace Editor Content</button>
                </div>
            </div>
        </div>
    );
};

// 2. Helper Component: AI Tools Panel
const AiToolsPanel = ({ aiPrompt, setAiPrompt, isLoading, loadingAction, handleAiGenerate, handleAiImprove }: any) => (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 space-y-4">
        <div className="flex items-center gap-3"><SolidSparklesIcon className="h-6 w-6 text-purple-600" /><h2 className="text-lg font-bold text-gray-800">AI Writing Assistant</h2></div>
        <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Generate New Draft</label>
            <div className="flex gap-2">
                <input type="text" placeholder="e.g., The Future of AI" className="flex-grow w-full bg-gray-100 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} disabled={isLoading} onKeyDown={(e) => { if (e.key === 'Enter') handleAiGenerate(); }}/>
                <button onClick={handleAiGenerate} disabled={isLoading} className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-purple-700 disabled:bg-gray-400 transition-colors">{loadingAction === "generate" ? <Spinner small /> : "Go"}</button>
            </div>
        </div>
        <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Edit & Transform Text</label>
            <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleAiImprove("Proofread")} disabled={isLoading} className="ai-improve-btn">{loadingAction === "Proofread" ? <Spinner small /> : <DocumentTextIcon className="h-5 w-5" />}<span>Proofread Selection</span></button>
                <button onClick={() => handleAiImprove("Make Professional")} disabled={isLoading} className="ai-improve-btn">{loadingAction === "Make Professional" ? <Spinner small /> : <SparklesIcon className="h-5 w-5" />}<span>Improve Selection</span></button>
                <button onClick={() => handleAiImprove("Summarize")} disabled={isLoading} className="ai-improve-btn col-span-2">{loadingAction === "Summarize" ? <Spinner small /> : <ClipboardDocumentListIcon className="h-5 w-5" />}<span>Summarize Entire Post</span></button>
            </div>
        </div>
    </div>
);

// 3. Helper Component: Publish Panel (Now receives isEditMode)
const PublishPanel = ({ handlePublish, isLoading, loadingAction, isEditMode }: any) => (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 space-y-4">
        <h2 className="text-lg font-bold text-gray-800">{isEditMode ? "Update Settings" : "Publish Settings"}</h2>
        <div><label className="text-sm font-semibold text-gray-600">Categories (coming soon)</label><div className="mt-2 p-3 bg-gray-100 rounded-lg text-sm text-gray-500">Add categories to your post.</div></div>
        <button onClick={handlePublish} disabled={isLoading} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white text-base font-bold rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition-all disabled:bg-gray-400">
            {loadingAction === 'publish' ? (<><Spinner />{isEditMode ? 'Updating...' : 'Publishing...'}</>) : (<><ArrowUpOnSquareIcon className="h-6 w-6" />{isEditMode ? 'Update Post' : 'Publish Post'}</>)}
        </button>
    </div>
);


// --- Main Publish Component ---
export const Publish = () => {
    // Hooks to determine mode
    const { blogId } = useParams();
    const isEditMode = !!blogId;

    // State for the form and editor
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();
    const quillRef = useRef<Quill | null>(null);

    // State for AI features and modal
    const [aiPrompt, setAiPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState("");

    // Effect for initializing the Quill editor
    useEffect(() => {
        if (quillRef.current === null) {
            const editor = new Quill("#editor", { theme: "snow", placeholder: "Let your ideas flow...", modules: { toolbar: "#toolbar-container" } });
            editor.on("text-change", () => setDescription(editor.root.innerHTML));
            quillRef.current = editor;
        }
    }, []);

    // Effect for fetching blog data when in edit mode
    useEffect(() => {
        if (isEditMode && quillRef.current) {
            setIsLoading(true);
            axios.get(`${BACKEND_URL}/api/v1/blog/${blogId}`, {
                headers: { Authorization: localStorage.getItem("token") }
            }).then(response => {
                const post = response.data.post;
                if (post) {
                    setTitle(post.title);
                    quillRef.current?.clipboard.dangerouslyPasteHTML(0, post.content || "");
                }
            }).catch(err => {
                console.error("Failed to fetch blog for editing:", err);
                alert("Could not load blog post. You may not have permission to edit this post.");
                navigate('/blogs');
            }).finally(() => {
                setIsLoading(false);
            });
        }
    }, [isEditMode, blogId]);

    // --- All Handler Functions ---
    const handleAiGenerate = async () => {
        if (!aiPrompt) return alert("Please enter a topic to generate a draft.");
        setIsModalOpen(true); setIsLoading(true); setLoadingAction("generate");
        try {
            const res = await axios.post(`${BACKEND_URL}/api/v1/ai/generate`, { prompt: aiPrompt }, { headers: { Authorization: localStorage.getItem("token") } });
            setAiSuggestion(res.data.content);
        } catch (err) { console.error(err); alert("AI Generation failed."); handleCloseModal(); }
        finally { setIsLoading(false); }
    };

    const handleAiImprove = async (instruction: ImproveInstruction) => {
        if (!quillRef.current) return;
        if (instruction === "Summarize") {
            const fullText = quillRef.current.getText();
            if (fullText.trim().length < 150) return alert("Please write more content before creating a summary.");
            setIsModalOpen(true); setIsLoading(true); setLoadingAction("Summarize");
            try {
                const fullHtml = quillRef.current.getSemanticHTML();
                const res = await axios.post(`${BACKEND_URL}/api/v1/ai/improve`, { textToImprove: fullHtml, instruction: "Summarize this text into a few key bullet points, keeping the output in HTML format." }, { headers: { Authorization: localStorage.getItem("token") } });
                setAiSuggestion(res.data.content);
            } catch (err) { console.error(err); alert("AI Summarization failed."); handleCloseModal(); }
            finally { setIsLoading(false); }
            return;
        }
        const range = quillRef.current.getSelection();
        if (!range || range.length === 0) return alert("Please select (highlight) the text you want to improve first.");
        const selectedText = quillRef.current.getSemanticHTML(range.index, range.length);
        setIsLoading(true); setLoadingAction(instruction);
        try {
            const res = await axios.post(`${BACKEND_URL}/api/v1/ai/improve`, { textToImprove: selectedText, instruction }, { headers: { Authorization: localStorage.getItem("token") } });
            quillRef.current.deleteText(range.index, range.length);
            quillRef.current.clipboard.dangerouslyPasteHTML(range.index, res.data.content);
        } catch (err) { console.error(err); alert("AI Improvement failed."); }
        finally { setIsLoading(false); setLoadingAction(""); }
    };

    const handleCloseModal = () => { setIsModalOpen(false); setAiSuggestion(""); setLoadingAction(""); };
    const handleReplaceContent = () => { if (quillRef.current) { quillRef.current.clipboard.dangerouslyPasteHTML(0, aiSuggestion); } handleCloseModal(); };
    const handleCopySuggestion = () => { const plainText = new DOMParser().parseFromString(aiSuggestion, "text/html").body.textContent || ""; navigator.clipboard.writeText(plainText); alert("Suggestion copied to clipboard!"); };

    const handlePublish = async () => {
        if (!title.trim() || !description.trim()) return alert("Please add a title and content.");
        setIsLoading(true);
        setLoadingAction('publish');
        const endpoint = `${BACKEND_URL}/api/v1/blog`;
        const method = isEditMode ? 'put' : 'post';
        const payload = { id: blogId, title, content: description };
        try {
            const response = await axios({ method, url: endpoint, data: payload, headers: { Authorization: localStorage.getItem("token") } });
            navigate(`/blog/${blogId || response.data.id}`);
        } catch (err) {
            console.error("Failed to save post:", err);
            alert(`Failed to ${isEditMode ? 'update' : 'publish'} post.`);
        } finally {
            setIsLoading(false);
            setLoadingAction('');
        }
    };

    return (
        <>
            <style>{`
                .editor-container .ql-toolbar { background: #fff; border: 1px solid #d1d5db; border-radius: 12px 12px 0 0; border-bottom: 0; padding: 12px; }
                .editor-container .ql-container { border: 1px solid #d1d5db; border-radius: 0 0 12px 12px; color: #1f2937; font-size: 1.1rem; line-height: 1.7; }
                .editor-container .ql-editor { min-height: 60vh; font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; padding: 2rem; }
                .ql-editor.ql-blank::before { font-style: normal; font-size: 1.1rem; color: #9ca3af; left: 2rem; }
                .ai-improve-btn { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.5rem; border-radius: 0.5rem; border: 1px solid #d1d5db; background-color: #f9fafb; color: #4b5563; font-weight: 500; transition: all 0.2s; }
                .ai-improve-btn:hover:not(:disabled) { background-color: #f3f4f6; }
                .ai-improve-btn:disabled { opacity: 0.6; cursor: not-allowed; }
            `}</style>
            
            <Appbar onPublish={handlePublish} isPublishing={loadingAction === 'publish'} />
            <AiSuggestionModal isOpen={isModalOpen} isLoading={isLoading} suggestion={aiSuggestion} onClose={handleCloseModal} onReplace={handleReplaceContent} onCopy={handleCopySuggestion} />

            <main className="min-h-screen w-full bg-slate-50 px-8 py-6">
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        <textarea
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            className="w-full text-5xl font-extrabold text-gray-800 bg-transparent resize-none border-none focus:ring-0 p-0"
                            placeholder="Your Masterpiece Title"
                            rows={1}
                            onInput={(e) => { const target = e.target as HTMLTextAreaElement; target.style.height = 'auto'; target.style.height = `${target.scrollHeight}px`; }}
                        />
                        <div className="editor-container">
                            <div id="toolbar-container">
                                <span className="ql-formats"><select className="ql-header" defaultValue="3"><option value="1">H1</option><option value="2">H2</option><option value="3">H3</option></select><select className="ql-font"></select><select className="ql-size"></select></span>
                                <span className="ql-formats"><button className="ql-bold"></button><button className="ql-italic"></button><button className="ql-underline"></button><button className="ql-strike"></button></span>
                                <span className="ql-formats"><select className="ql-color"></select><select className="ql-background"></select></span>
                                <span className="ql-formats"><button className="ql-list" value="ordered"></button><button className="ql-list" value="bullet"></button><button className="ql-blockquote"></button><button className="ql-code-block"></button></span>
                                <span className="ql-formats"><button className="ql-script" value="sub"></button><button className="ql-script" value="super"></button><select className="ql-align"></select></span>
                                <span className="ql-formats"><button className="ql-link"></button><button className="ql-image"></button><button className="ql-video"></button></span>
                                <span className="ql-formats"><button className="ql-clean"></button></span>
                            </div>
                            <div id="editor"></div>
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <PublishPanel handlePublish={handlePublish} isLoading={isLoading} loadingAction={loadingAction} isEditMode={isEditMode} />
                        <AiToolsPanel aiPrompt={aiPrompt} setAiPrompt={setAiPrompt} isLoading={isLoading} loadingAction={loadingAction} handleAiGenerate={handleAiGenerate} handleAiImprove={handleAiImprove} />
                    </div>
                </div>
            </main>
        </>
    );
};