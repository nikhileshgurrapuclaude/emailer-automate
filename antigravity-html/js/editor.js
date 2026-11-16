/**
 * Content Editor & Dual Bold Handler
 * Provides:
 * - Visual Bold button toolbar
 * - Ctrl+B / Cmd+B keyboard shortcut
 * - Markdown **bold** typing detection
 * - Paragraph insertion helper
 */

class ContentEditor {
  constructor(textareaElement, toolbarElement, onContentChange) {
    this.textarea = textareaElement;
    this.toolbar = toolbarElement;
    this.onContentChange = onContentChange;

    this._bindEvents();
  }

  _bindEvents() {
    if (!this.textarea) return;

    // Real-time input listener with debounced callback
    let debounceTimer;
    this.textarea.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (typeof this.onContentChange === 'function') {
          this.onContentChange(this.textarea.value);
        }
      }, 150);
    });

    // Keyboard Shortcuts (Ctrl+B, Cmd+B)
    this.textarea.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        this.toggleBold();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        this.toggleItalic();
      }
    });

    // Toolbar buttons
    if (this.toolbar) {
      const boldBtn = this.toolbar.querySelector('[data-action="bold"]');
      const italicBtn = this.toolbar.querySelector('[data-action="italic"]');
      const paraBtn = this.toolbar.querySelector('[data-action="paragraph"]');

      if (boldBtn) {
        boldBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleBold();
        });
      }

      if (italicBtn) {
        italicBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleItalic();
        });
      }

      if (paraBtn) {
        paraBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.insertParagraph();
        });
      }
    }
  }

  // Toggle Markdown bold **text** around selected text
  toggleBold() {
    this._wrapSelection('**', '**', 'bold text');
  }

  // Toggle Markdown italic *text* around selected text
  toggleItalic() {
    this._wrapSelection('*', '*', 'italic text');
  }

  // Insert a clear paragraph break (\n\n)
  insertParagraph() {
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    const val = this.textarea.value;

    const insertText = '\n\n';
    this.textarea.value = val.substring(0, start) + insertText + val.substring(end);
    this.textarea.selectionStart = this.textarea.selectionEnd = start + insertText.length;
    this.textarea.focus();

    if (typeof this.onContentChange === 'function') {
      this.onContentChange(this.textarea.value);
    }
  }

  // Core selection wrapper logic
  _wrapSelection(prefix, suffix, placeholder) {
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    const val = this.textarea.value;
    const selectedText = val.substring(start, end);

    let newText;
    let newCursorPos;

    // If text is already wrapped, unwrap it (toggle behavior)
    const beforePrefix = val.substring(start - prefix.length, start);
    const afterSuffix = val.substring(end, end + suffix.length);

    if (beforePrefix === prefix && afterSuffix === suffix) {
      // Unwrap
      this.textarea.value = val.substring(0, start - prefix.length) + selectedText + val.substring(end + suffix.length);
      this.textarea.selectionStart = start - prefix.length;
      this.textarea.selectionEnd = end - prefix.length;
    } else if (selectedText.startsWith(prefix) && selectedText.endsWith(suffix) && selectedText.length >= (prefix.length + suffix.length)) {
      // Selected text itself contains the tags: unwrap
      const unwrapped = selectedText.substring(prefix.length, selectedText.length - suffix.length);
      this.textarea.value = val.substring(0, start) + unwrapped + val.substring(end);
      this.textarea.selectionStart = start;
      this.textarea.selectionEnd = start + unwrapped.length;
    } else {
      // Wrap text
      const content = selectedText || placeholder;
      newText = prefix + content + suffix;
      this.textarea.value = val.substring(0, start) + newText + val.substring(end);
      
      if (!selectedText) {
        // Highlight placeholder so user can immediately type over it
        this.textarea.selectionStart = start + prefix.length;
        this.textarea.selectionEnd = start + prefix.length + placeholder.length;
      } else {
        this.textarea.selectionStart = start;
        this.textarea.selectionEnd = start + newText.length;
      }
    }

    this.textarea.focus();

    if (typeof this.onContentChange === 'function') {
      this.onContentChange(this.textarea.value);
    }
  }

  setValue(val) {
    if (this.textarea) {
      this.textarea.value = val || '';
      if (typeof this.onContentChange === 'function') {
        this.onContentChange(this.textarea.value);
      }
    }
  }

  getValue() {
    return this.textarea ? this.textarea.value : '';
  }
}

window.ContentEditor = ContentEditor;
