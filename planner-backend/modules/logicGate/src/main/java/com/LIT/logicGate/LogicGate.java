package com.LIT.logicGate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LogicGate {
    public static void main(String[] args) {
        /*try {
            Class.forName("org.mariadb.jdbc.Driver");
            System.out.println("MariaDB Driver Loaded Successfully!");
        } catch (ClassNotFoundException e) {
            System.err.println("Failed to load MariaDB driver!");
            e.printStackTrace();
        }*/

        SpringApplication.run(LogicGate.class, args);
    }
}
