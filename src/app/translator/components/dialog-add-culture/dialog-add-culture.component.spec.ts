import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddCultureComponent } from './dialog-add-culture.component';

describe('DialogAddCultureComponent', () => {
  let component: DialogAddCultureComponent;
  let fixture: ComponentFixture<DialogAddCultureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogAddCultureComponent]
    });
    fixture = TestBed.createComponent(DialogAddCultureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
