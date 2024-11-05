

export class Course {
    constructor(name, desiredAverage) {
      this.name = name;
      this.average = 100;
      this.desiredAverage = desiredAverage; //replace with user input in whatever way you like
      this.assignmentTypes = [];
    }

    setDesiredAverage(paramAverage)
    {
        this.desiredAverage = paramAverage;
    }

    addAssignmentType(name, weight) {
        let assignmentType = new AssignmentType(name, weight);

        if (assignmentType instanceof AssignmentType) {
            this.assignmentTypes.push(assignmentType);
        } else {
            throw new Error("Argument must be an assignmentType");
        }
    }
    getAssignmentTypes()
    {
        return this.assignmentTypes;
    }

    readAssignmentType() {
        this.assignmentTypes.forEach(assignmentType => {
            //console.log(assignmentType.getAssignmentName());
            //console.log(assignmentType.getAssignmentWeight());

        });
    }
    resetCourse()
    {
        this.name = "";
    }

    getName(){
        return(this.name);
    }

    getAverage(){
        return(this.average);
    }

    addGrade(title, type, score, dueDate){
         //finds the grade type (weight) which matches with the inputted type.
        const gradeTypeIndex = this.assignmentTypes.findIndex(assignment => assignment.getAssignmentName() === type);

        if(gradeTypeIndex == -1){
            //console.log("grade can not be added: does not match a weight.");
            return;
        }

        this.assignmentTypes[gradeTypeIndex].addGrade(title, type, score, dueDate)
    }

    calculateAverage(){
        let assignmentTypeAverageArray = [];
        let assignmentWeightArray = [];

        this.assignmentTypes.forEach((assignmentType) => {

            const assignmentAvg = assignmentType.getAssignmentTypeAverage();
            //console.log(assignmentType.getAssignmentName() + "assignmentAvg: " + assignmentAvg);
            const assignmentWeight = assignmentType.getAssignmentWeight();

            if(assignmentType.isEmpty === false)
            {
                assignmentTypeAverageArray.push(assignmentAvg);
                assignmentWeightArray.push(assignmentWeight);
                
            }

            
        });

        //AverageCalcuation here.
        const totalWeight = assignmentWeightArray.reduce((sum, weight) => sum + weight, 0);
        //console.log(JSON.stringify(assignmentWeightArray, null, 2));
        //console.log(JSON.stringify(assignmentTypeAverageArray, null, 2));
        const weightedAverage = assignmentTypeAverageArray.reduce((sum, avg, index) => sum + (avg * assignmentWeightArray[index]), 0) / totalWeight;
        //console.log(JSON.stringify(weightedAverage, null, 2));
        this.average = weightedAverage;

        return this.average;
    }

    // This will calculate the grade needed for the first future assignment in each assignment weight type.
    // In list mode, should be listed with a higher weight, earlier time, earlier date preferance. 
    //EX: tests should be listed earlier than homework even if they are due at the same time.
    calcFutureGradesByType(){
        //let gradesNeededForEachWeight = [];
        this.calculateAverage();
        let scoreNeeded = 0;

        this.assignmentTypes.forEach((assignmentType) => {
            //TODO: put a failsafe here, in case no grades are marked with an index of "-".

            let index = -1;
            //index = assignmentType.grades.findIndex(grade => grade.getScore() === "-"); //selects the first empty grade in each type's list, calculates based off that.
            var grades = assignmentType.getAssignments();
            if(grades != undefined)
            {
                grades.forEach(grade => {
                    index++;
                    if(grade.getScore() === '-')
                    {
                        scoreNeeded = ((this.desiredAverage - (1 - assignmentType.getAssignmentWeight()) * this.average)/assignmentType.getAssignmentWeight()); //calculates needed score for first future assignment of that weight.=
                        scoreNeeded = Math.ceil(scoreNeeded)
                        assignmentType.setScoreNeeded(scoreNeeded, index);
                    }
                })
            }
           /*  if (index === -1) {
                //console.log(`No future assignment found for type ${assignmentType.getAssignmentName()}`);
                return;
            } */
  
           

        });
        
    }

    //parses through all assignments to find a grade. Will be replaced with a more efficient function.
    getNeededGrade(title){
        for (const assignmentType of this.assignmentTypes) {
            const index = assignmentType.grades.findIndex(grade => grade.getGradeTitle() === title);
            if (index !== -1) {
                return assignmentType.getScoreNeeded(index);
            }
        }
        return undefined; // Return undefined if the grade is not found
    }

}

export class AssignmentType {
    constructor(name, weight) {
      this.name = name;
      this.weight = weight;
      this.grades = [];
      this.isEmpty = true;
      this.hasDash = false;
    }

    addGrade(title, type, score, dueDate) {

        let grade = new Grade(title, type, score, dueDate);
        if(this.isEmpty){
            if(score != "-")
            {
                this.isEmpty = false;
            }
        }
        if(!this.hasDash)
        {
            if(score === '-')
            {
                this.hasDash = true;
            }
        }

        if (grade instanceof Grade) {
            this.grades.push(grade);
        } else {
            throw new Error("Argument must be a grade");
        }
    }

    getAssignmentWeight(){
        return this.weight;
    }

    getAssignmentName(){
        return this.name;
    }
    getAssignments()
    {
        return this.grades;
    }

    setScoreNeeded(scoreNeeded, index){
        this.grades[index].setScoreNeeded(scoreNeeded);
    }

    getScoreNeeded(index){
        return this.grades[index].getScoreNeeded();
    }

    getAssignmentTypeAverage(){
        if (this.grades.length === 0 || this.isEmpty) return 0;
        let dropped = 0; //used to drop grades not yet published.
        let total = 0;

        for(var i = 0; i < this.grades.length; i++) {
            //console.log(this.grades[i].getScore());

            //if the grade is entered, score is added to the array.
            if(typeof this.grades[i].getScore() != 'string'){
                total += this.grades[i].getScore();
                //console.log("score for " + this.grades[i].getGradeTitle() + " added");
            }
            else{
                dropped++;
            }
        }
        return total / (this.grades.length - dropped);
    }
}

export class Grade {
    constructor(title, type, score, dueDate) {
        
        this.title = title;
        this.type = type;
        this.score = score;
        this.dueDate = dueDate;
        this.scoreNeeded = -1;
    }

    getScore(){
        return this.score;
    }

    setScoreNeeded(scoreNeeded){
        this.scoreNeeded = scoreNeeded;
    }

    getScoreNeeded(){
        return this.scoreNeeded;
    }

    getGradeTitle(){
        return this.title
    }
}

/* //creates a course with a name and a desired average.
let course = new Course("Course1", 90);

//course.addAssignmentType(Name, weight);
course.addAssignmentType("Homework", .20);
course.addAssignmentType("Quiz", .30);
course.addAssignmentType("Test", .50);

//course.readAssignmentType();


//course.addGrade(title, type, score, dueDate);

course.addGrade("Homework1", "Homework", 90, "dueDate1");
course.addGrade("Quiz1", "Quiz", 85, "dueDate2");
course.addGrade("Test1", "Test", 90, "dueDate3");

//console.log(" ")

course.calculateAverage();
//console.log(course.getAverage());

//console.log(" ")

course.addGrade("Homework2", "Homework", "-", "dueDate4");
course.addGrade("Quiz2", "Quiz", "-", "dueDate5");
course.addGrade("Test2", "Test", "-", "dueDate6");

//console.log(" ")

course.calcFutureGradesByType();

//console.log(" ")

course.getNeededGrade("Quiz2");
//console.log(" ")
course.getNeededGrade("Homework2");
//console.log(" ")
course.getNeededGrade("Test2");
 */
