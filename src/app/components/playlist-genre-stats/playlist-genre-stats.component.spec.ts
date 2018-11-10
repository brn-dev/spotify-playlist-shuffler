import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistGenreStatsComponent } from './playlist-genre-stats.component';

describe('PlaylistGenreStatsComponent', () => {
  let component: PlaylistGenreStatsComponent;
  let fixture: ComponentFixture<PlaylistGenreStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistGenreStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistGenreStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
