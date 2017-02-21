#!/usr/bin/env python3
import unittest


class Person:
  """
  Complete this class.
  """
  name = ""
  age = null

  def __init__(self, name: str, age: int):
    """
    Initialize a Person.
    :type name: object
    :type age: object
    """
    self.name = name
    self.age = age
    pass


def by_name(directory: list, name: str):
  """
  Write a function to return a Person object by name.
  :param directory: List of Person
  :param name: Name to find in directory
  :return: The Person object
  """
  for (Person person_from_dir : list)
    if (person_from_dir.name == name)
        return directory.get("name")
  return None


class Tests(unittest.TestCase):
  """
  Write passing tests.
  """
  #
  directory = [
    Person(name="John", age=20),
    Person(name="Ally", age=25),
    Person(name="Jordan", age=30),
  ]

  def test_byname(self):
    self.assertTrue(False, "Found John")
    self.assertTrue(False, "Found Ally")
    self.assertTrue(False, "Found Jordan")

  def test_missing(self):
    self.assertTrue(False, "Not found")


if __name__ == '__main__':
  unittest.main()

// Java

public class Person {
    private int age;
    private String name;

    public Person(String name, int age) {
        this.age = age;
        this.name = name;
    }
}

public class DoProblem {

    public ArrayList<Person> directory = new ArrayList<Person>();
    public HashMap<String, Person> hash_directory = new HashMap<String, Person>();

    public static void main(String[] args) {
        directory.add(new Person("John", 20));
        directory.add(new Person("Ally", 25));
        directory.add(new Person("Jordan", 30));

    }

    public Person by_name(String name_to_search) {
        for (int i = 0; i < directory.size(); i++) {
            if (name_to_search.equalsIgnoreCase(directory.get(i).name)) {
                return directory.get(i).name;
            }
        }
        return null;
    }

    public void list_to_hash() {
        for (int i = 0; i < directory.size(); i++) {
            Person p = directory.get(i);
            hash_directory.addEntry(p.name, p.age);
        }
    }

    public Person by_name_hash(String name_to_search) {
        if (!hash_directory.isEmpty()) {
            return hash_directory.get(name_to_search);
        }
        return null;
    }
}

#!/usr/bin/env python3

import unittest


def flatten(tree: object) -> object:
  # Implement this function

  return


class Tests(unittest.TestCase):
  """
  """
  tree = [
         1,
       [2, 3],
    [4, [5, [6]]],
    [[[[[[7]]]]]],
  ]

  def test_flatten(self):
    self.assertTrue(flatten(None) is None, "flattened")
    self.assertTrue(flatten([]) == [], "flattened")
    self.assertTrue(flatten([[[[[[[]]]]]]]) == [], "flattened")
    self.assertTrue(flatten([1]) == [1], "flattened")
    self.assertTrue(flatten([[[[[[[1]]]]]]]) == [1], "flattened")
    self.assertTrue(flatten(Tests.tree) == [1, 2, 3, 4, 5, 6, 7], "flattened")

  def test_unexpected(self):
    self.assertTrue(flatten('123456') is None, "handled")
    self.assertTrue(flatten(Tests) is None, "handled")
    self.assertTrue(flatten(flatten) is None, "handled")


if __name__ == '__main__':
  unittest.main()

// pre-order
int[][][][] arr = [1, [2, 3], [4, [5, [6]]], [7]];
public static void main(String[] args) {

}
// Javascript
var arr = [];
arr = [1, [2, 3], [4, [5, [6]]], [7]];
var result_arr = array_recursive(arr, result_arr);

function array_recursive (arr, result_arr) {
    for (var elem in arr) {
        if (elem typeof int) {
            result_arr.push(elem);
        } else {
            return array_recursive(elem);
        }
    }
    return result_arr;
}
<_>
<_>
<_>
<_>
// Javascript
var arr = [];
arr = [1, [2, 3], [4, [5, [6]]], [7]];
var result_arr = array_recursive(arr, []);

function array_recursive (arr, result_arr) {
    for (var i in arr) {
        var elem = arr[i];
        if (typeof elem === 'object') {
            return array_recursive(elem, result_arr);
        } else {
            result_arr.push(elem);
        }
    }
    return result_arr;
}


document.getElementById('log1').innerHTML = "" + result_arr;
