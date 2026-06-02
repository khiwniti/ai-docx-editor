import React from 'react';
import { 
  Undo2, Redo2, Bold, Italic, Underline, Strikethrough, 
  Link as LinkIcon, Image as ImageIcon, Table, 
  AlignLeft, List, ChevronDown, Type, PenLine, AlignJustify, ListOrdered, ListCollapse
} from 'lucide-react';

export function EditorToolbar() {
  return (
    <div className="flex items-center gap-1 px-4 py-1.5 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#1e1e2e] select-none overflow-x-auto scrollbar-hide shrink-0 min-h-[44px]">
      {/* History */}
      <div className="flex items-center gap-0.5 pr-2 border-r border-slate-300 dark:border-white/10">
        <ToolbarButton icon={<Undo2 className="w-[18px] h-[18px]" />} label="Undo" />
        <ToolbarButton icon={<Redo2 className="w-[18px] h-[18px]" />} label="Redo" />
      </div>

      {/* Typography */}
      <div className="flex items-center gap-1 px-2 border-r border-slate-300 dark:border-white/10">
        <ToolbarSelect value="100%" width="w-[70px]" />
        <ToolbarSelect value="Arial" width="w-[110px]" />
        <div className="flex items-center">
          <ToolbarSelect value="20" width="w-[60px]" />
        </div>
      </div>

      {/* Inline Styles */}
      <div className="flex items-center gap-0.5 px-2 border-r border-slate-300 dark:border-white/10">
        <ToolbarButton icon={<Bold className="w-[18px] h-[18px]" />} label="Bold" active />
        <ToolbarButton icon={<Italic className="w-[18px] h-[18px]" />} label="Italic" />
        <ToolbarButton icon={<Underline className="w-[18px] h-[18px]" />} label="Underline" />
        <ToolbarButton icon={<Strikethrough className="w-[18px] h-[18px]" />} label="Strikethrough" />
      </div>

      {/* Colors & Inserts */}
      <div className="flex items-center gap-0.5 px-2 border-r border-slate-300 dark:border-white/10">
        <ToolbarButton icon={<Type className="w-[18px] h-[18px]" />} label="Text Color" hasDropdown />
        <ToolbarButton icon={<PenLine className="w-[18px] h-[18px]" />} label="Highlight Color" hasDropdown />
        <div className="w-px h-5 bg-slate-300 dark:bg-white/10 mx-1" />
        <ToolbarButton icon={<LinkIcon className="w-[18px] h-[18px]" />} label="Insert Link" />
        <ToolbarButton icon={<ImageIcon className="w-[18px] h-[18px]" />} label="Insert Image" />
        <ToolbarButton icon={<Table className="w-[18px] h-[18px]" />} label="Insert Table" hasDropdown />
      </div>

      {/* Paragraph & Layout */}
      <div className="flex items-center gap-0.5 pl-2 border-r border-slate-300 dark:border-white/10 pr-2">
        <ToolbarButton icon={<AlignLeft className="w-[18px] h-[18px]" />} label="Align" hasDropdown />
        <ToolbarButton icon={<List className="w-[18px] h-[18px]" />} label="Bullet List" hasDropdown />
        <ToolbarButton icon={<ListOrdered className="w-[18px] h-[18px]" />} label="Numbered List" hasDropdown />
        <ToolbarButton icon={<ListCollapse className="w-[18px] h-[18px]" />} label="Indent" hasDropdown />
        <ToolbarButton icon={<AlignJustify className="w-[18px] h-[18px]" />} label="Line Height" hasDropdown />
      </div>
      
      {/* Right spacer for alignment matching Google Docs style */}
      <div className="flex-1" />
    </div>
  );
}

function ToolbarButton({ icon, label, active, hasDropdown }: { icon: React.ReactNode, label: string, active?: boolean, hasDropdown?: boolean }) {
  return (
    <button 
      type="button"
      className={`flex items-center gap-0.5 p-1.5 rounded-sm hover:bg-slate-200 dark:hover:bg-white/10 transition-colors ${active ? 'bg-slate-200/80 dark:bg-white/15 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}
      title={label}
    >
      {icon}
      {hasDropdown && <ChevronDown className="w-3 h-3 text-slate-500 opacity-70 ml-0.5" />}
    </button>
  );
}

function ToolbarSelect({ value, width }: { value: string, width: string }) {
  return (
    <button 
      type="button"
      className={`flex items-center justify-between px-2 py-1.5 rounded-sm hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-sm text-slate-700 dark:text-slate-200 ${width}`}
    >
      <span className="truncate">{value}</span>
      <ChevronDown className="w-3.5 h-3.5 text-slate-500 opacity-70 shrink-0" />
    </button>
  );
}
