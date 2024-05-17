import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoiSettingsComponent } from './roi-settings.component';

describe('RoiSettingsComponent', () => {
  let component: RoiSettingsComponent;
  let fixture: ComponentFixture<RoiSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoiSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoiSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
