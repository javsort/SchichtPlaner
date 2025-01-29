package com.LIT.testApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TestApp {
    public static void main(String[] args) {
        /*try {
            Class.forName("org.mariadb.jdbc.Driver");
            System.out.println("MariaDB Driver Loaded Successfully!");
        } catch (ClassNotFoundException e) {
            System.err.println("Failed to load MariaDB driver!");
            e.printStackTrace();
        }*/

        SpringApplication.run(TestApp.class, args);
    }
}
