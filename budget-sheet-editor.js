(function () {
    // Prevent multiple initializations
    if (window.budgetSheetEditorInitialized) {
        return;
    }
    window.budgetSheetEditorInitialized = true;

    function getSheetKey() {
        var path = (location.pathname || '').split('?')[0];
        var file = path.split('/').pop() || 'budget_sheet';
        return 'budgetSheet:' + file;
    }

    function getTable() {
        return document.querySelector('table.excel-table');
    }

    function getEditableCells(table) {
        if (!table) return [];
        var cells = Array.prototype.slice.call(table.querySelectorAll('tbody td'));
        return cells.filter(function (td) {
            return !td.classList.contains('col-a');
        });
    }

    function snapshotTable(table) {
        var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'));
        return rows.map(function (tr) {
            var tds = Array.prototype.slice.call(tr.querySelectorAll('td'));
            var editable = tds.filter(function (td) { return !td.classList.contains('col-a'); });
            return editable.map(function (td) { return td.textContent; });
        });
    }

    function applySnapshot(table, snap) {
        var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'));
        for (var r = 0; r < rows.length; r++) {
            var tds = Array.prototype.slice.call(rows[r].querySelectorAll('td'));
            var editable = tds.filter(function (td) { return !td.classList.contains('col-a'); });
            var rowSnap = snap[r] || [];
            for (var c = 0; c < editable.length; c++) {
                if (typeof rowSnap[c] === 'string') editable[c].textContent = rowSnap[c];
            }
        }
    }

    function ensureStyles() {
        if (document.getElementById('budget-sheet-editor-styles')) return;
        var style = document.createElement('style');
        style.id = 'budget-sheet-editor-styles';
        style.textContent = "\n" +
            ".excel-btn.editor-btn{background:#10b981;}\n" +
            ".excel-btn.editor-btn:hover{filter:brightness(.95);}\n" +
            ".excel-btn.editor-btn.secondary{background:#6b7280;}\n" +
            ".excel-btn.editor-btn.secondary:hover{filter:brightness(.95);}\n" +
            ".excel-btn.editor-btn.danger{background:#ef4444;}\n" +
            ".excel-btn.editor-btn.danger:hover{filter:brightness(.95);}\n" +
            ".excel-btn[disabled]{opacity:.5;cursor:not-allowed;}\n" +
            ".excel-table td.cell-editable{background:#fffbea;outline:1px solid rgba(251,191,36,.5);}\n" +
            ".excel-table td.cell-dirty{background:#fef3c7;}\n";
        document.head.appendChild(style);
    }

    function createButton(label, variant) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'excel-btn editor-btn' + (variant ? (' ' + variant) : '');
        btn.textContent = label;
        return btn;
    }

    function init() {
        var table = getTable();
        if (!table) return;

        ensureStyles();

        var key = getSheetKey();
        var originalSnapshot = snapshotTable(table);
        var savedSnapshot = null;
        var savedRaw = null;

        try {
            savedRaw = localStorage.getItem(key);
            if (savedRaw) {
                savedSnapshot = JSON.parse(savedRaw);
                if (!Array.isArray(savedSnapshot)) {
                    console.warn('Invalid saved data format, ignoring saved snapshot');
                    savedSnapshot = null;
                }
            }
        } catch (e) {
            if (e instanceof SyntaxError) {
                console.error('Invalid JSON in localStorage, ignoring saved data:', e);
            } else if (e.name === 'QuotaExceededError') {
                console.error('localStorage quota exceeded, ignoring saved data:', e);
            } else {
                console.error('Error accessing localStorage, ignoring saved data:', e);
            }
            savedSnapshot = null;
        }

        if (savedSnapshot && Array.isArray(savedSnapshot)) {
            applySnapshot(table, savedSnapshot);
        }

        var controls = document.querySelector('.excel-controls');
        if (!controls) return;

        // Remove any existing editor buttons to prevent duplicates
        var existingButtons = controls.querySelectorAll('.editor-btn');
        existingButtons.forEach(function(btn) {
            btn.remove();
        });

        var editBtn = createButton('Edit', 'secondary');
        var saveBtn = createButton('Save');
        var undoBtn = createButton('Undo', 'danger');

        controls.appendChild(editBtn);
        controls.appendChild(saveBtn);
        controls.appendChild(undoBtn);

        var editing = false;
        var dirty = false;

        function setDirty(next) {
            dirty = next;
            saveBtn.disabled = !editing || !dirty;
            undoBtn.disabled = !editing;
        }

        function setEditing(next) {
            editing = next;
            var cells = getEditableCells(table);
            cells.forEach(function (td) {
                td.contentEditable = editing ? 'true' : 'false';
                td.spellcheck = false;
                td.classList.toggle('cell-editable', editing);
                if (!editing) td.classList.remove('cell-dirty');
            });

            editBtn.textContent = editing ? 'Stop' : 'Edit';
            editBtn.classList.toggle('secondary', !editing);
            setDirty(false);
        }

        function markDirtyCell(td) {
            if (!editing) return;
            td.classList.add('cell-dirty');
            if (!dirty) setDirty(true);
        }

        table.addEventListener('input', function (e) {
            var td = e.target && e.target.closest ? e.target.closest('td') : null;
            if (!td) return;
            if (td.classList.contains('col-a')) return;
            if (td.contentEditable !== 'true') return;
            markDirtyCell(td);
        });

        editBtn.addEventListener('click', function () {
            setEditing(!editing);
        });

        saveBtn.addEventListener('click', function () {
            if (!editing) return;
            var snap = snapshotTable(table);
            try {
                localStorage.setItem(key, JSON.stringify(snap));
                savedSnapshot = snap;
                setDirty(false);
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    alert('Could not save: Storage quota exceeded. Please clear some data or try again.');
                } else if (e.name === 'SecurityError') {
                    alert('Could not save: Storage access denied. Please check your browser settings.');
                } else {
                    alert('Could not save: An unexpected error occurred. Please try again.');
                }
                console.error('Save error:', e);
            }
        });

        undoBtn.addEventListener('click', function () {
            if (!editing) return;
            var base = savedSnapshot || originalSnapshot;
            applySnapshot(table, base);
            setDirty(false);
        });

        setEditing(false);
        saveBtn.disabled = true;
        undoBtn.disabled = true;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
