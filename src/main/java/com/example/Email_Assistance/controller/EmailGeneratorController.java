package com.example.Email_Assistance.controller;

import com.example.Email_Assistance.EmailAssistanceApplication;
import com.example.Email_Assistance.entity.EmailRequest;
import com.example.Email_Assistance.service.EmailGeneratorService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController

@CrossOrigin(origins = "*")
@RequestMapping("/api/email")
public class EmailGeneratorController {
    private  EmailGeneratorService emailGeneratorService;
    public EmailGeneratorController(EmailGeneratorService emailGeneratorService){
        this.emailGeneratorService=emailGeneratorService;
    }
    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest){
        String response=emailGeneratorService.generateResponse(emailRequest);
        return ResponseEntity.ok(response);
    }
}
