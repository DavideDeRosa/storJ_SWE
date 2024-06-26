import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { MultipleChoiceService } from '../../services/multiple-choice.service';
import { multipleChoice } from '../../multipleChoice';
import { ScenarioService } from '../../services/scenario.service';
import { scenario } from '../../scenario';
import { storyObject } from '../../storyObject';
import { RequiredService } from '../../services/required.service';
import { storyObjectService } from '../../services/story-object.service';
import { required } from '../../required';
import { StoryService } from '../../services/story.service';


@Component({
  selector: 'app-form-multiple-choice',
  templateUrl: './form-multiple-choice.component.html',
  styleUrl: './form-multiple-choice.component.css'
})
export class FormMultipleChoiceComponent {

  idScenario = -1;
  testo = '';
  idScenarioSuccessivo = -1;
  storyScenarios: scenario[] = [];
  storyObjects: storyObject[] = [];
  selectedObjectId: number = -1;
  isInTextEditMode!: boolean;
  currentMultipleChoiche!: multipleChoice | null;
  currentScenarioText!: string;

  constructor(private http: HttpClient, private multipleChoiceService: MultipleChoiceService, private scenarioService: ScenarioService, private router: Router, private requiredService: RequiredService, private storyObjectService: storyObjectService, private localStorageService: LocalStorageService, private storyService: StoryService) { }

  ngOnInit(): void {
    this.loadScenarioId();
    this.loadStoryScenarios(this.idScenario);
    this.loadStoryObjects();
    this.isInTextEditMode = this.storyService.isStoryCompleted();
    this.loadCurrentMultipleChoice();

  }

  loadCurrentMultipleChoice(): void {
    this.currentMultipleChoiche = this.localStorageService.getItem("currentMultipleChoice");

    if (this.isInTextEditMode && this.currentMultipleChoiche) {
      this.setScenarioText(this.currentMultipleChoiche.id_scenario_successivo);

    }

  }

  loadScenarioId() {
    const currentScenario = this.localStorageService.getItem('currentScenario');
    if (currentScenario) {
      this.idScenario = currentScenario.id;
    } else {
      alert('id scenario non trovato');
    }
  }

  loadStoryObjects() {
    const currentStoryId = this.localStorageService.getItem('currentStory')?.id;
    if (currentStoryId) {
      this.storyObjectService.getStoryObjectByStoryId(currentStoryId).subscribe(
        (objects) => {
          this.storyObjects = objects;
        },
        (error) => alert('Errore nel caricamento degli oggetti')//(Da modificare) 
      );
    }
  }

  loadStoryScenarios(idScenario: number) {
    const currentStoryId = this.localStorageService.getItem('currentStory')?.id;
    if (currentStoryId) {
      this.scenarioService.getScenarioByStoryId(currentStoryId).subscribe(scenarios => {
        this.storyScenarios = scenarios.filter(scenario => scenario.id !== idScenario);
      }, error => console.error(error));
    }
  }

  public saveRequired(required: required) {
    this.requiredService.addRequired(required).subscribe(
      (response: required) => {
        this.requiredService.changeRequired(response);
        console.log("required creato con successo!");
      },
      (error: HttpErrorResponse) => {

        console.log("c'è stato un errore nella crezione del required" + error.error.message)
      }
    );
  }


  public savemultiplechoice(multiplechoice: multipleChoice): void {
    this.multipleChoiceService.addMultipleChoice(multiplechoice).subscribe(
      (response: multipleChoice) => {
        this.multipleChoiceService.changeMultipleChoice(response);
        if (this.selectedObjectId != -1) {
          const objrequired: required = {
            id: 0,
            id_scelta: response.id,
            id_oggetto: this.selectedObjectId
          };
          this.saveRequired(objrequired);

        }

        this.router.navigateByUrl('/multiplechoice').then(() => {

          window.location.reload();
        });
      },
      (error: HttpErrorResponse) => {

        if (error.error.code == "UtenteAlreadySigned") {
          alert(error.error.message);
        } else {
          alert("c'è stato un errore:" + error.error.message);
        }

      }
    );
  }

  onSubmit() {
    const multiplechoiceData: multipleChoice = {
      id: 0,
      id_scenario: this.idScenario,
      testo: this.testo,
      id_scenario_successivo: this.idScenarioSuccessivo
    };

    if (this.testo == '' || this.idScenarioSuccessivo == -1) {
      alert("Inserisci tutti i campi obbligatori (*)");
    } else {
      this.savemultiplechoice(multiplechoiceData);
    }

  }

  onTextChange(newTesto: string): void {
    if (this.currentMultipleChoiche) {
      this.currentMultipleChoiche.testo = newTesto; // Aggiorna il testo dello scenario corrente
    }
    this.testo = newTesto; // Aggiorna la variabile testo del componente
  }


  isUpdated(): boolean {
    return !this.testo.trim();
  }

  updateMultipleChoicheText() {

    if (this.currentMultipleChoiche) {
      const newMultipleChoicheData: multipleChoice = {
        id: this.currentMultipleChoiche.id,
        id_scenario: this.idScenario,
        testo: this.testo,
        id_scenario_successivo: this.currentMultipleChoiche.id_scenario_successivo
      };

      console.log("i nuovi dati della scelta multipla: " + JSON.stringify(newMultipleChoicheData));

      this.multipleChoiceService.updateMultipleChoice(newMultipleChoicheData).subscribe({
        next: (updatedMultipleChoice) => {

          this.multipleChoiceService.changeMultipleChoice(newMultipleChoicheData);
          console.log("Scelta multpla aggiornata con successo:", updatedMultipleChoice);

          this.router.navigateByUrl('/multiplechoice').then(() => {

            window.location.reload();
          });
        },
        error: (error) => {

          console.error("Errore durante l'aggiornamento della scelta multipla:", error);
        }
      });

    }

  }

  setScenarioText(idCorrectScenario: number): void {
    this.scenarioService.getScenarioById(idCorrectScenario).subscribe({
      next: (scenario) => {
        this.currentScenarioText = scenario.testo;
        console.log("Testo dello scenario corretto impostato con successo:", this.currentScenarioText);
      },
      error: (error) => {
        console.error("Errore durante il recupero del testo dello scenario:", error);
      }
    });
  }

}