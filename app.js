var app = angular.module("studentApp", []);

app.controller("studentCtrl", function($scope, $http) {
  // This API URL must match the backend server below.
  var API = "http://localhost:3000/students";

  $scope.students = [];
  $scope.filteredStudents = [];
  $scope.page = "home";
  $scope.message = "";
  $scope.form = {};
  $scope.editingId = null;
  $scope.isError = false;

  function showMessage(text, isError) {
    $scope.message = text;
    $scope.isError = !!isError;
  }

  $scope.loadStudents = function() {
    $http.get(API).then(function(response) {
      $scope.students = response.data;
      applyCurrentSearch();
    }).catch(function() {
      showMessage("Unable to connect to backend. Check that the server is running.", true);
    });
  };

  function applyCurrentSearch() {
    var q = ($scope.searchName || "").trim().toLowerCase();
    $scope.filteredStudents = q
      ? $scope.students.filter(function(s) { return s.name.toLowerCase().includes(q); })
      : $scope.students.slice();
  }

  $scope.goTo = function(page) {
    $scope.page = page;
    showMessage("", false);
    if (page === "view") $scope.loadStudents();
  };

  // CREATE and UPDATE
  $scope.saveStudent = function() {
    var student = {
      name: ($scope.form.name || "").trim(),
      regno: ($scope.form.regno || "").trim(),
      department: ($scope.form.department || "").trim()
    };
    if (!student.name || !student.regno || !student.department) {
      showMessage("Please fill in all fields.", true);
      return;
    }

    var request = $scope.editingId
      ? $http.put(API + "/" + $scope.editingId, student)
      : $http.post(API, student);

    request.then(function(response) {
      showMessage($scope.editingId ? "Student updated successfully!" : "Student added successfully!", false);
      $scope.resetForm();
      $scope.loadStudents();
    }).catch(function(response) {
      showMessage((response.data && response.data.error) || "Save failed. Check the backend.", true);
    });
  };

  // Fill form for UPDATE
  $scope.editStudent = function(student) {
    $scope.editingId = student._id;
    $scope.form = {
      name: student.name,
      regno: student.regno,
      department: student.department
    };
    $scope.page = "add";
    showMessage("Edit the details and click Update Student.", false);
  };

  $scope.resetForm = function() {
    $scope.form = {};
    $scope.editingId = null;
  };

  // READ + SEARCH
  $scope.searchStudent = function() {
    if (!($scope.searchName || "").trim()) {
      showMessage("Enter a student name to search.", true);
      applyCurrentSearch();
      return;
    }
    applyCurrentSearch();
    showMessage($scope.filteredStudents.length ? "Student(s) found." : "Student not found.", !$scope.filteredStudents.length);
  };

  $scope.clearSearch = function() {
    $scope.searchName = "";
    $scope.filteredStudents = $scope.students.slice();
    showMessage("", false);
  };

  // DELETE
  $scope.deleteStudent = function(student) {
    if (!confirm("Delete " + student.name + "?")) return;
    $http.delete(API + "/" + student._id).then(function() {
      $scope.students = $scope.students.filter(function(s) { return s._id !== student._id; });
      applyCurrentSearch();
      showMessage("Student deleted successfully!", false);
    }).catch(function(response) {
      showMessage((response.data && response.data.error) || "Failed to delete student.", true);
    });
  };

  $scope.loadStudents();
});
