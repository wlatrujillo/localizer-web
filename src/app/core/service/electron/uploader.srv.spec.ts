import { TestBed } from '@angular/core/testing';

import { UploaderSrv } from './uploader.srv';

describe('UploaderSrv', () => {
  let service: UploaderSrv;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploaderSrv);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


});
