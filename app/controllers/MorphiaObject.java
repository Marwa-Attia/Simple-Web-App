package controllers;

import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.Morphia;

import com.mongodb.Mongo;

public class MorphiaObject {
	static public Mongo mongo;
	static public Morphia morphia;
	static public Datastore datastore;
}
