import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFromListComponent } from './delete-from-list.component';

describe('DeleteFromListComponent', () => {
  let component: DeleteFromListComponent;
  let fixture: ComponentFixture<DeleteFromListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteFromListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteFromListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
