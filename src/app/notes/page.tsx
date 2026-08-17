"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Plus,
  Pin,
  PinOff,
  Trash2,
  FileText,
  Clock,
  Tag,
  ChevronDown,
  Bold,
  Italic,
  List,
  Heading1,
  Heading2,
  Quote,
  Code,
  Minus,
} from "lucide-react";
import { useNoteStore } from "@/stores/note-store";
import { PageHeader } from "@/components/layout/header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

const NOTE_CATEGORIES = [
  "All",
  "General",
  "Work",
  "Personal",
  "Ideas",
  "Meeting Notes",
  "Research",
  "Journal",
];

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\n/g, " ").trim();
}

export default function NotesPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("General");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { notes, addNote, updateNote, deleteNote, pinNote } = useNoteStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredNotes = (() => {
    let result = [...notes];
    if (selectedCategory !== "All") {
      result = result.filter((n) => n.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  })();

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  useEffect(() => {
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditContent(selectedNote.content);
      setEditCategory(selectedNote.category);
    }
  }, [selectedNoteId]);

  const autoSave = useCallback(
    (title: string, content: string, category: string) => {
      if (!selectedNoteId) return;
      setSaveStatus("saving");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        updateNote(selectedNoteId, { title, content, category });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      }, 500);
    },
    [selectedNoteId, updateNote]
  );

  const handleTitleChange = (val: string) => {
    setEditTitle(val);
    autoSave(val, editContent, editCategory);
  };

  const handleContentChange = (val: string) => {
    setEditContent(val);
    autoSave(editTitle, val, editCategory);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  const handleCategoryChange = (cat: string) => {
    setEditCategory(cat);
    setShowCategoryDropdown(false);
    autoSave(editTitle, editContent, cat);
  };

  const createNewNote = () => {
    addNote({
      title: "Untitled Note",
      content: "",
      category: selectedCategory === "All" ? "General" : selectedCategory,
      pinned: false,
    });
    const newest = useNoteStore.getState().notes;
    const last = newest[newest.length - 1];
    if (last) {
      setSelectedNoteId(last.id);
      setEditTitle(last.title);
      setEditContent(last.content);
      setEditCategory(last.category);
    }
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    deleteNote(deleteConfirm);
    if (selectedNoteId === deleteConfirm) {
      setSelectedNoteId(null);
    }
    setDeleteConfirm(null);
  };

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    if (!textareaRef.current) return;
    const ta = textareaRef.current;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = editContent.substring(start, end);
    const newContent =
      editContent.substring(0, start) +
      prefix +
      selected +
      suffix +
      editContent.substring(end);
    setEditContent(newContent);
    autoSave(editTitle, newContent, editCategory);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selected.length
      );
    }, 0);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Notes"
        description="Capture your thoughts and ideas"
      />

      <div className="flex gap-6 h-[calc(100vh-180px)] min-h-[500px]">
        {/* Left Panel - Note List */}
        <div className="w-80 flex-shrink-0 flex flex-col rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden max-md:hidden">
          {/* Search */}
          <div className="p-4 border-b border-[hsl(var(--border))]">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
              />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] py-2 pl-9 pr-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="px-4 py-3 border-b border-[hsl(var(--border))] overflow-x-auto">
            <div className="flex gap-1.5 flex-nowrap">
              {NOTE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
                    selectedCategory === cat
                      ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                      : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Note List */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotes.length === 0 ? (
              <div className="p-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
                No notes found
              </div>
            ) : (
              filteredNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`w-full text-left px-4 py-3.5 border-b border-[hsl(var(--border)/0.5)] transition-all duration-200 hover:bg-[hsl(var(--muted)/0.5)] ${
                    selectedNoteId === note.id
                      ? "bg-[hsl(var(--primary)/0.05)] border-l-2 border-l-[hsl(var(--primary))]"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {note.pinned && (
                          <Pin
                            size={12}
                            className="text-[hsl(var(--primary))] flex-shrink-0"
                          />
                        )}
                        <p className="text-sm font-semibold text-[hsl(var(--card-foreground))] truncate">
                          {note.title}
                        </p>
                      </div>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 line-clamp-2">
                        {stripHtml(note.content) || "Empty note"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="rounded-md bg-[hsl(var(--muted))] px-1.5 py-0.5 text-[10px] font-medium text-[hsl(var(--muted-foreground))]">
                          {note.category}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                          <Clock size={10} />
                          {timeAgo(note.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* New Note Button */}
          <div className="p-3 border-t border-[hsl(var(--border))]">
            <button
              onClick={createNewNote}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-[hsl(var(--primary)/0.25)]"
            >
              <Plus size={16} />
              New Note
            </button>
          </div>
        </div>

        {/* Mobile: Simple list + editor toggle */}
        <div className="md:hidden flex-1 flex flex-col">
          {selectedNoteId === null ? (
            <div className="flex-1 flex flex-col rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
              <div className="p-4 border-b border-[hsl(var(--border))]">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                  />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className="w-full text-left px-4 py-3.5 border-b border-[hsl(var(--border)/0.5)] hover:bg-[hsl(var(--muted)/0.5)]"
                  >
                    <p className="text-sm font-semibold truncate">{note.title}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 line-clamp-1">
                      {stripHtml(note.content) || "Empty note"}
                    </p>
                  </button>
                ))}
              </div>
              <div className="p-3 border-t border-[hsl(var(--border))]">
                <button
                  onClick={createNewNote}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))]"
                >
                  <Plus size={16} /> New Note
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Right Panel - Editor */}
        <div className="flex-1 flex flex-col rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden max-md:hidden">
          {selectedNote ? (
            <>
              {/* Editor Header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-[hsl(var(--border))]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowCategoryDropdown(!showCategoryDropdown)
                      }
                      className="flex items-center gap-1.5 rounded-lg bg-[hsl(var(--muted))] px-2.5 py-1 text-xs font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted)/0.8)]"
                    >
                      <Tag size={12} />
                      {editCategory}
                      <ChevronDown size={12} />
                    </button>
                    {showCategoryDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-40 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-1 shadow-lg z-10">
                        {NOTE_CATEGORIES.filter((c) => c !== "All").map(
                          (cat) => (
                            <button
                              key={cat}
                              onClick={() => handleCategoryChange(cat)}
                              className={`w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-[hsl(var(--muted))] ${
                                editCategory === cat
                                  ? "text-[hsl(var(--primary))] font-medium"
                                  : "text-[hsl(var(--foreground))]"
                              }`}
                            >
                              {cat}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                  {saveStatus === "saving" && (
                    <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                      Saving...
                    </span>
                  )}
                  {saveStatus === "saved" && (
                    <span className="text-[10px] text-emerald-500">Saved</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => pinNote(selectedNoteId!)}
                    className={`rounded-lg p-2 transition-colors ${
                      selectedNote.pinned
                        ? "text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]"
                        : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
                    }`}
                    title={selectedNote.pinned ? "Unpin" : "Pin"}
                  >
                    {selectedNote.pinned ? (
                      <PinOff size={16} />
                    ) : (
                      <Pin size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(selectedNoteId!)}
                    className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--destructive)/0.1)] hover:text-[hsl(var(--destructive))]"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Formatting Toolbar */}
              <div className="flex items-center gap-0.5 px-6 py-2 border-b border-[hsl(var(--border))]">
                <button
                  onClick={() => insertMarkdown("**", "**")}
                  className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                  title="Bold"
                >
                  <Bold size={14} />
                </button>
                <button
                  onClick={() => insertMarkdown("*", "*")}
                  className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                  title="Italic"
                >
                  <Italic size={14} />
                </button>
                <button
                  onClick={() => insertMarkdown("# ")}
                  className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                  title="Heading 1"
                >
                  <Heading1 size={14} />
                </button>
                <button
                  onClick={() => insertMarkdown("## ")}
                  className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                  title="Heading 2"
                >
                  <Heading2 size={14} />
                </button>
                <div className="w-px h-5 bg-[hsl(var(--border))] mx-1" />
                <button
                  onClick={() => insertMarkdown("- ")}
                  className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                  title="List"
                >
                  <List size={14} />
                </button>
                <button
                  onClick={() => insertMarkdown("> ")}
                  className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                  title="Quote"
                >
                  <Quote size={14} />
                </button>
                <button
                  onClick={() => insertMarkdown("`", "`")}
                  className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                  title="Code"
                >
                  <Code size={14} />
                </button>
                <button
                  onClick={() => insertMarkdown("\n---\n")}
                  className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                  title="Divider"
                >
                  <Minus size={14} />
                </button>
              </div>

              {/* Title */}
              <div className="px-6 pt-5">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Note title..."
                  className="w-full text-2xl font-bold text-[hsl(var(--card-foreground))] placeholder:text-[hsl(var(--muted-foreground)/0.4)] bg-transparent border-none outline-none"
                />
              </div>

              {/* Content */}
              <div className="flex-1 px-6 py-4 overflow-y-auto">
                <textarea
                  ref={textareaRef}
                  value={editContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Start writing..."
                  className="w-full min-h-[300px] text-sm text-[hsl(var(--card-foreground))] placeholder:text-[hsl(var(--muted-foreground)/0.4)] bg-transparent border-none outline-none resize-none leading-relaxed"
                />
              </div>
            </>
          ) : (
            <EmptyState
              icon="FileText"
              title="Select a note"
              description="Choose a note from the list or create a new one to start writing"
              action={{
                label: "New Note",
                onClick: createNewNote,
              }}
            />
          )}
        </div>

        {/* Mobile Editor */}
        {selectedNoteId && selectedNote && (
          <div className="md:hidden fixed inset-0 z-40 bg-[hsl(var(--background))] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))]">
              <button
                onClick={() => setSelectedNoteId(null)}
                className="text-sm font-medium text-[hsl(var(--primary))]"
              >
                Back
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => pinNote(selectedNoteId!)}
                  className="p-2"
                >
                  {selectedNote.pinned ? (
                    <PinOff size={16} />
                  ) : (
                    <Pin size={16} />
                  )}
                </button>
                <button
                  onClick={() => setDeleteConfirm(selectedNoteId!)}
                  className="p-2 text-[hsl(var(--destructive))]"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="px-4 pt-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Note title..."
                className="w-full text-xl font-bold bg-transparent border-none outline-none"
              />
            </div>
            <div className="flex-1 px-4 py-3 overflow-y-auto">
              <textarea
                value={editContent}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Start writing..."
                className="w-full min-h-[400px] text-sm bg-transparent border-none outline-none resize-none leading-relaxed"
              />
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Note"
        description="This note will be permanently deleted. This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
