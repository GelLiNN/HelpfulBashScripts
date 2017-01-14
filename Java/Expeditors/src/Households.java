import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Map;
import java.util.TreeMap;

/**
 * Created by Kellan Nealy on 1/13/17.
 */
public class Households {

    /**
     * Main runnable method for Households.java
     * @param args
     */
    public static void main(String[] args) {
        System.out.println("Processing households...\n");
        HouseholdStore householdStore = new HouseholdStore();

        // Read input from housemembers.txt
        try {
            String contents = new String(Files.readAllBytes(Paths.get("housemembers.txt")));
            String[] lines = contents.split("\n");
            for (String line : lines) {
                String[] linecontents = line.split("\"");
                String[] cleancontents = getCleanContents(linecontents);
                householdStore.addMember(cleancontents);
            }
            householdStore.printHouseholds();
        } catch (Exception e) {
            System.out.println("File read error: \n" + e.getMessage());
        }
    }

    /**
     * Helper method to remove unclean data pieces when splitting
     * @param linecontents
     * @return
     */
    public static String[] getCleanContents(String[] linecontents) {
        String[] cleancontents = new String[6];
        int itr = 0;
        for (int i = 0; i < linecontents.length; i++) {
            if (linecontents[i] != null && !linecontents[i].equals(", ") && !linecontents[i].equals(" ")
                    && !linecontents[i].equals("") && !linecontents[i].equals(",")) {
                cleancontents[itr] = linecontents[i];
                itr++;
            }
        }
        return cleancontents;
    }
}

/**
 * Nested class for storing, handling, and printing household data
 */
class HouseholdStore {
    private TreeMap<String, Integer> household_counts;
    private TreeMap<String, ArrayList<String>> household_members;

    /**
     * Constructs new HouseholdStore
     */
    public HouseholdStore() {
        household_counts = new TreeMap<String, Integer>();
        household_members = new TreeMap<String, ArrayList<String>>();
    }

    /**
     * Add new member to this HouseholdStore
     * @param memberDetails String[] containing information for this member
     */
    public void addMember(String[] memberDetails) {

        // get each piece of data and construct address
        String first_name = memberDetails[0];
        String last_name = memberDetails[1];
        String street_addr = memberDetails[2];
        String city = memberDetails[3];
        String state = memberDetails[4];
        String age = memberDetails[5];

        // modify street address to remove unnecessary punctuation
        street_addr = street_addr.replace(",", "");
        street_addr = street_addr.replace(".", "");

        // store household address
        String household_address = last_name.toUpperCase() + " "
                + street_addr.toLowerCase() + " "
                + city.toLowerCase() + " "
                + state.toUpperCase();

        // add household to household_counts and household_members maps
        if (!household_counts.containsKey(household_address)) {
            household_counts.put(household_address, 1);
            // construct new ArrayList for household members since this household is new
            ArrayList<String> housemembers = new ArrayList<String>();
            housemembers.add(last_name + " " + first_name + " " + age);
            household_members.put(household_address, housemembers);
        } else {
            Integer curCount = household_counts.get(household_address);
            household_counts.replace(household_address, curCount + 1);
            // add new household member to existing household
            ArrayList<String> curMembers = household_members.get(household_address);
            curMembers.add(last_name + " " + first_name + " " + age);
            household_members.replace(household_address, curMembers);
        }
    }

    /**
     * Prints all information for each household pertaining to the specification
     */
    public void printHouseholds() {
        // print counts and members above 18, already ordered by last/first name because of TreeMap
        for(Map.Entry<String,Integer> household : household_counts.entrySet()) {
            String household_address = household.getKey();
            Integer count = household.getValue();
            System.out.println("Household Address: " + household_address + "\nMember Count: " + count);

            ArrayList<String> members = household_members.get(household_address);
            for(String member : members) {
                String[] data = member.split(" ");
                int age = Integer.parseInt(data[2]);
                if (age > 18) {
                    System.out.println("Member above 18: " + member);
                }
            }
            System.out.println();
        }
    }
}
