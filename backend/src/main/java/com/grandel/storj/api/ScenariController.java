package com.grandel.storj.api;

import com.grandel.storj.dto.DropDTO;
import com.grandel.storj.dto.IndovinelloDTO;
import com.grandel.storj.dto.MultiplaDTO;
import com.grandel.storj.dto.ScenarioDTO;
import com.grandel.storj.mapper.DropMapper;
import com.grandel.storj.mapper.IndovinelloMapper;
import com.grandel.storj.mapper.MultiplaMapper;
import com.grandel.storj.mapper.ScenarioMapper;
import com.grandel.storj.service.DropBL;
import com.grandel.storj.service.IndovinelloBL;
import com.grandel.storj.service.MultiplaBL;
import com.grandel.storj.service.ScenarioBL;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import storj.api.ScenariApi;
import storj.model.Drop;
import storj.model.Indovinello;
import storj.model.Multipla;
import storj.model.Scenario;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Controller
@EnableAutoConfiguration
@RequestMapping("/api/v1")
public class ScenariController implements ScenariApi {

    @Autowired
    private ScenarioBL scenarioBL;
    @Autowired
    private ScenarioMapper scenarioMapper;
    @Autowired
    private DropMapper dropMapper;
    @Autowired
    private DropBL dropBL;
    @Autowired
    private MultiplaMapper multiplaMapper;
    @Autowired
    private MultiplaBL multiplaBL;
    @Autowired
    private IndovinelloMapper indovinelloMapper;
    @Autowired
    private IndovinelloBL indovinelloBL;

    public ResponseEntity<Scenario> getScenarioById(Long idScenario) {
        log.info("method getScenarioById()");

        ScenarioDTO scenarioDTO = scenarioBL.getScenarioDTOById(idScenario);

        return new ResponseEntity<>(scenarioMapper.scenarioDTOToScenario(scenarioDTO), HttpStatus.OK);
    }

    public ResponseEntity<Scenario> postScenario(Scenario scenario) {
        log.info("method postScenario()");

        ScenarioDTO scenarioDTO = scenarioBL.postScenario(scenarioMapper.scenarioToScenarioDTO(scenario));

        return new ResponseEntity<>(scenarioMapper.scenarioDTOToScenario(scenarioDTO), HttpStatus.OK);
    }

    public ResponseEntity<Scenario> putScenario(Long idScenario, Scenario scenario) {
        log.info("method putScenario()");

        ScenarioDTO scenarioDTO = scenarioBL.putScenario(idScenario, scenarioMapper.scenarioToScenarioDTO(scenario));

        return new ResponseEntity<>(scenarioMapper.scenarioDTOToScenario(scenarioDTO), HttpStatus.OK);
    }

    public ResponseEntity<Void> deleteScenario(Long idScenario) {
        log.info("method deleteScenario()");

        scenarioBL.deleteScenario(idScenario);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    public ResponseEntity<Indovinello> getSceltaIndovinelloByScenario(Long idScenario) {
        log.info("method getSceltaIndovinelloByScenario()");

        IndovinelloDTO indovinelloDTO = indovinelloBL.getIndovinelloByScenario(idScenario);

        return new ResponseEntity<>(indovinelloMapper.indovinelloDTOToIndovinello(indovinelloDTO), HttpStatus.OK);
    }

    public ResponseEntity<List<Multipla>> getScelteMultipleByScenario(Long idScenario) {
        log.info("method getScelteMultipleByScenario()");

        List<Multipla> multiple = new ArrayList<>();

        for (MultiplaDTO x : multiplaBL.getMultipleByScenario(idScenario)) {
            multiple.add(multiplaMapper.multiplaDTOToMultipla(x));
        }

        return new ResponseEntity<>(multiple, HttpStatus.OK);
    }

    public ResponseEntity<Drop> getDropByScenario(Long idScenario) {
        log.info("method getDropByScenario()");

        DropDTO dropDTO = dropBL.getDropByScenario(idScenario);

        return new ResponseEntity<>(dropMapper.dropDTOToDrop(dropDTO), HttpStatus.OK);
    }
}
