package com.birmanBank.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import de.bwaldvogel.mongo.MongoServer;
import de.bwaldvogel.mongo.backend.memory.MemoryBackend;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.InetSocketAddress;

@Configuration
public class MongoConfig {

    private static final Logger log = LoggerFactory.getLogger(MongoConfig.class);

    @Value("${spring.data.mongodb.uri:}")
    private String mongoUri;

    @Bean
    public MongoClient mongoClient() {
        if (mongoUri != null && !mongoUri.isEmpty()) {
            try {
                log.info("Attempting to connect to primary MongoDB URI");
                MongoClient client = MongoClients.create(mongoUri);
                // test connection by fetching database names
                client.listDatabaseNames().first();
                log.info("Successfully connected to primary MongoDB");
                return client;
            } catch (Exception e) {
                log.warn("Failed to connect to primary MongoDB, falling back to in-memory DB. Reason: {}", e.getMessage());
            }
        } else {
            log.info("No MongoDB URI provided, falling back to in-memory DB.");
        }
        
        log.info("Starting in-memory MongoDB...");
        MongoServer server = new MongoServer(new MemoryBackend());
        InetSocketAddress serverAddress = server.bind();
        String localUri = "mongodb://127.0.0.1:" + serverAddress.getPort();
        log.info("In-memory MongoDB started at {}", localUri);
        
        return MongoClients.create(localUri);
    }
}
