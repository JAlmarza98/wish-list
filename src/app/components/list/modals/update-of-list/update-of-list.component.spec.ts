import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOfListComponent } from './update-of-list.component';

describe('UpdateOfListComponent', () => {
  let component: UpdateOfListComponent;
  let fixture: ComponentFixture<UpdateOfListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateOfListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateOfListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
