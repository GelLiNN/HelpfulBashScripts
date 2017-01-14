/**
 * 
 * @author Kellan Nealy
 * AD325, Assignment 7: Tokens and Types
 * Can be used to count tokens and types in multiple files
 * Supports ordered printing and unordered printing.
 */
public class WordCount {
 
	public static void main(String[] args) {
		countTokensInFiles(args);
	}
	
	/**
	 * 
	 * @param filenames command line arguments of files to count tokens, 
	 * will accept "-o" option for ordering. counts all the tokens in multiple files,
	 * prints the different types of tokens with counts to System.out
	 */
	public static void countTokensInFiles(String[] filenames) {

		if (filenames.length == 0) {
			System.out.println("Please provide filenames to count token types!");
			return;
		}
		// build the map for adding
		java.util.Map<String, MyCounter> counts = new java.util.HashMap<String, MyCounter>();
		
		// open the file for reading using Scanner
		for (String filename : filenames) {
			countTokens(counts, filename);
		}
		
		// print the different types according to the order option
		boolean shouldBeOrdered = lookForOrderOption(filenames);
		if (shouldBeOrdered) {
			printTypesOrdered(counts);
		} else {
			printTypesUnordered(counts);
		}
		System.out.println();
	}
	
	public static boolean lookForOrderOption(String[] filenames) {
		for (String item : filenames) {
			if (item.equalsIgnoreCase("-o")) {
				return true;
			}
		}
		return false;
	}
	
	/**
	 * 
	 * @param counts the map of token counts to be added to
	 * @param filename the current file to count tokens
	 * counts tokens if the file can be found, prints nice errors otherwise
	 */
	public static void countTokens(java.util.Map<String, MyCounter> counts, String filename) {
		
		java.util.Scanner scan;
		
		try {
			scan = new java.util.Scanner(new java.io.File(filename));
		} catch(java.io.FileNotFoundException e) {
			
			if (!filename.equalsIgnoreCase("-o")) {
				//only print the error if this incorrect file ISNT the order option
				System.out.println("Error: " + filename + " was not found!");
			}
			return;
		}
		
		// process the file, token by token
		int i = 0;
		while(scan.hasNext()) {
			//make everything lower case to ignore case
			String token = scan.next().toLowerCase();
			if (counts.containsKey(token)) {
				// if map already contains the token, increment by 1
				counts.get(token).increment();
			} else {
				// no token found, put new entry in the map
				MyCounter newCounter = new MyCounter();
				newCounter.increment();
				counts.put(token, newCounter);
			}
			i++;
		}
		
		// close the file
		scan.close();
		// output statistics for this file
		System.out.println(filename + " : " + i + " total tokens.");
	}
	
	/**
	 * 
	 * @param types the map of counts of different tokens
	 * prints types ordered in a descending order by token count
	 */
	public static void printTypesOrdered(java.util.Map<String, MyCounter> types) {
		
		// create list of 
		java.util.List<java.util.Map.Entry<String, MyCounter>> entries =
				new java.util.ArrayList<java.util.Map.Entry<String, MyCounter>>(types.entrySet());
		
		java.util.Collections.sort(entries, new java.util.Comparator<java.util.Map.Entry<String, MyCounter>>() {
            @Override
            public int compare(java.util.Map.Entry<String, MyCounter> entry1,
                               java.util.Map.Entry<String, MyCounter> entry2) {
                return entry1.getValue().getValue() >= entry2.getValue().getValue() ? -1 : 1;
            }
        });
		
		for (java.util.Map.Entry entry : entries) {
            MyCounter current = (MyCounter) entry.getValue();
            int count = current.getValue();
            if (count > 2) {
                System.out.printf("%4s %s %n", count, ": " + entry.getKey());
            }
        }
	}
	
	/**
	 * 
	 * @param types the map of counts of different tokens
	 * prints types unordered
	 */
	public static void printTypesUnordered(java.util.Map<String, MyCounter> types) {
		java.util.Set<String> keys = types.keySet();
		
		for (String key : keys) {
			int curCount = types.get(key).getValue();
			if (curCount > 2) {
				System.out.printf("%4s %s %n", curCount, ": " + key);
			}
		}
	}
}

/**
 * 
 * @author Kellan Nealy
 * MyCounter class fixes the autoboxing problem for the check version
 * 
 */
class MyCounter {
	private int value;
	
	public MyCounter() {
		value = 0;
	}
	
	public int getValue() {
		return value;
	}
	
	public void increment() {
		value++;
	}
}
