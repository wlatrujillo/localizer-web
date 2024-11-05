import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProcessFileComponent } from './dialog-process-file.component';

describe('DialogProcessFileComponent', () => {
  let component: DialogProcessFileComponent;
  let fixture: ComponentFixture<DialogProcessFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogProcessFileComponent]
    });
    fixture = TestBed.createComponent(DialogProcessFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
