package com.cms.maintenance;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.context.config.annotation.RefreshScope;

@SpringBootApplication
@RefreshScope
public class MaintenanceApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(MaintenanceApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
	}

}
