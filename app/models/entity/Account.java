package models.entity;

import org.mongodb.morphia.annotations.Embedded;

@Embedded
public class Account  {

	public Account() {
		
	}

	private String name;
 
    public String getName() {
        return name;
    }
 
    public void setName(String name) {
        this.name = name;
    }
 
}
