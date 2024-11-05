import { TestBed } from '@angular/core/testing';

import { GeneratorSqlSrv } from './generator.sql.srv';

describe('GeneratorSqlSrv', () => {
  let service: GeneratorSqlSrv;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneratorSqlSrv);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
