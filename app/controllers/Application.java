package controllers;

import models.entity.Account;
import models.entity.Address;
import models.entity.Customer;
import play.libs.Json;
import play.mvc.BodyParser;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.index;

import com.fasterxml.jackson.databind.JsonNode;

public class Application extends Controller {

	public static Result index() {
		return ok(index.render("Your new application is ready."));
	}

	public static Result allCustomers() {
		JsonNode json = null;
		Customer customer = new Customer();
		json = Json.toJson(customer.all());
		return ok(json).as("application/json");
	}

	@BodyParser.Of(BodyParser.Json.class)
	public static Result addCustomer() {
		JsonNode json = request().body().asJson();
		String name = json.findPath("name").textValue();
		String accountName = json.findPath("account").textValue();
		String addressNumber = json.findPath("number").textValue();
		String addressStreet = json.findPath("street").textValue();
		String addressTown = json.findPath("town").textValue();
		String addressPostcode = json.findPath("postcode").textValue();
		Address address = new Address();
		address.setNumber(addressNumber);
		address.setStreet(addressStreet);
		address.setTown(addressTown);
		address.setPostcode(addressPostcode);
		Account account = new Account();
		account.setName(accountName);
		Customer customer = new Customer();
		customer.setAddress(address);
		customer.setName(name);
		customer.setAccount(account);
		customer.create(customer);

		JsonNode result = Json.toJson(customer.all());
		return ok(result).as("application/json");

	}
}
