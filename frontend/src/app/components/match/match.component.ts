import { Component } from '@angular/core';
import { match } from '../../match';
import { MatchService } from '../../services/match.service';
import { UserService } from '../../services/userservice';
import { StoryService } from '../../services/story.service';
import { Router } from '@angular/router'; import { LocalStorageService } from '../../services/local-storage.service';
;

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrl: './match.component.css'
})
export class MatchComponent {
  userMatches: match[] = [];
  storyTitleMap: Map<number, string | undefined> = new Map();

  constructor(private router: Router, private matchService: MatchService, private userService: UserService, private storyService: StoryService, private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.loadUserMatches();
  }

  async loadUserMatches() {
    const userId = this.userService.getCurrentUser()?.id;
    if (userId) {
      await this.matchService.getMatchByUser(userId).subscribe({
        next: (matches) => {
          this.userMatches = matches.sort((a, b) => a.id - b.id);
          this.loadStoryTitles(this.userMatches);
        },
        error: (error) => {
          console.error('Errore durante il caricamento delle partite dell\'utente:', error);
        }
      });
    }
  }

  async loadStoryTitles(matches: match[]): Promise<void> {
    for (const match of matches) {
      try {
        const story = await this.storyService.getStoriesByStoryID(match.id_storia).toPromise();

        if (story) {
          const trimmedTitle = story.titolo.length > 25 ? `${story.titolo.slice(0, 25)}...` : story.titolo;
          this.storyTitleMap.set(match.id, trimmedTitle);
        }
      } catch (error) {
        console.error(`Errore nel caricamento del titolo della storia per la partita ${match.id}: ${error}`);
      }
    }
  }

  resumeMatch(match: match) {
    this.storyService.getStoriesByStoryID(match.id_storia).subscribe({
      next: (response) => {
        this.storyService.changeStory(response);
        this.matchService.setIsFirstMatch(false);
        this.localStorageService.setItem('currentMatch', match);
        this.localStorageService.setItem('currentScenarioID', match.id_scenario_corrente);
        this.matchService.changeMatch(match);

        this.router.navigateByUrl('/playPage');
      },
      error: (error) => {
        console.error('Errore nel riprendere la partita', error);
      }
    });
  }

  removeMatch(match: match) {
    this.matchService.deleteMatch(match.id);
    location.reload();
  }

}