import { TestBed } from '@angular/core/testing';

import { GeneratorJsSrv } from './generator.js.srv';

describe('GeneratorJsSrv', () => {
  let service: GeneratorJsSrv;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneratorJsSrv);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
