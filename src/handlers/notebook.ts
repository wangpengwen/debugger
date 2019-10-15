// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { INotebookTracker, NotebookTracker } from '@jupyterlab/notebook';

import { CodeCell } from '@jupyterlab/cells';

import { CellManager } from './cell';

import { Debugger } from '../debugger';

import { Breakpoints } from '../breakpoints';

import { IDisposable } from '@phosphor/disposable';

import { Signal } from '@phosphor/signaling';

export class DebuggerNotebookHandler implements IDisposable {
  constructor(options: DebuggerNotebookHandler.IOptions) {
    this.debuggerModel = options.debuggerModel;
    this.notebookTracker = options.notebookTracker;
    this.breakpoints = this.debuggerModel.sidebar.breakpoints.model;
    this.notebookTracker.activeCellChanged.connect(this.onNewCell, this);
  }

  private notebookTracker: INotebookTracker;
  private debuggerModel: Debugger.Model;
  private breakpoints: Breakpoints.Model;
  private cellManager: CellManager;
  isDisposed: boolean;

  dispose(): void {
    if (this.isDisposed) {
      return;
    }
    this.isDisposed = true;
    this.cellManager.dispose();
    Signal.clearData(this);
  }

  protected onNewCell(noteTracker: NotebookTracker, codeCell: CodeCell) {
    if (this.cellManager) {
      this.cellManager.activeCell = codeCell;
      this.cellManager.onActiveCellChanged();
    } else {
      this.cellManager = new CellManager({
        breakpointsModel: this.breakpoints,
        activeCell: codeCell,
        debuggerModel: this.debuggerModel,
        type: 'notebook'
      });
    }
  }
}

export namespace DebuggerNotebookHandler {
  export interface IOptions {
    debuggerModel: Debugger.Model;
    notebookTracker: INotebookTracker;
  }
}