import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmRemoveComponent } from './dialog-confirm-remove.component';

describe('DialogRemoveComponent', () => {
  let component: DialogConfirmRemoveComponent;
  let fixture: ComponentFixture<DialogConfirmRemoveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogConfirmRemoveComponent]
    });
    fixture = TestBed.createComponent(DialogConfirmRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
