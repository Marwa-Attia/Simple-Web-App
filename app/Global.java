import java.net.UnknownHostException;

import org.mongodb.morphia.Morphia;

import play.GlobalSettings;
import play.Logger;

import com.mongodb.MongoClient;

import controllers.MorphiaObject;

public class Global extends GlobalSettings {
	
	@Override
	public void onStart(play.Application arg0) {
		super.beforeStart(arg0);
		Logger.debug("** onStart **");
		try {
			MorphiaObject.mongo = new MongoClient("127.0.0.1", 27017);
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
		MorphiaObject.morphia = new Morphia();
		MorphiaObject.datastore = MorphiaObject.morphia.createDatastore(
				MorphiaObject.mongo, "test");
		MorphiaObject.datastore.ensureIndexes();
		MorphiaObject.datastore.ensureCaps();

		Logger.debug("** Morphia datastore: " + MorphiaObject.datastore.getDB());
	}
}
