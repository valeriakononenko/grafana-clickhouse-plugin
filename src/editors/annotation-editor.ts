import { Default } from '../model/model';

export class AnnotationEditor {
  static templateUrl = 'partials/annotations-editor.html';

  annotation: any;

  constructor() {
    this.annotation.query = this.annotation.query || Default.QUERY;
  }
}
