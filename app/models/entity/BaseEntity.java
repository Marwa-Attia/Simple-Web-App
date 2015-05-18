package models.entity;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.mongodb.morphia.Key;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.annotations.Property;
import org.mongodb.morphia.annotations.Version;

import controllers.MorphiaObject;

public abstract class BaseEntity {

	@Id
	@Property("id")
	protected ObjectId id;

	@Version
	@Property("version")
	private Long version;

	public BaseEntity() {
		super();
	}

	public ObjectId getId() {
		return id;
	}

	public void setId(ObjectId id) {
		this.id = id;
	}

	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	public List<? extends BaseEntity> all() {
		if (MorphiaObject.datastore != null) {
			return MorphiaObject.datastore.find(this.getClass()).asList();
		} else {
			return new ArrayList<BaseEntity>();
		}
	}

	public Key<BaseEntity> create(BaseEntity group) {
		return MorphiaObject.datastore.save(group);
	}

}
