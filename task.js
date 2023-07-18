#!/usr/bin/env node
const fs = require("fs");
const args = process.argv.slice(2);

const read = (file) => {
  let tasks = fs.readFileSync(file).toString().split("\n").sort().slice(1);
  return tasks;
}
const write = (file, data) => {
  fs.writeFileSync(
    file,
    data,
    (err) => {
      if (err) throw err;
    }
  );
}
const append = (file, data) => {
  fs.appendFileSync(
    file,
    data + "\n",
    (err) => {
      if (err) throw err;
    }
  )
}

if (args[0] == "help" || args.length == 0) {
  console.log(`Usage :-
  $ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
  $ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
  $ ./task del INDEX            # Delete the incomplete item with the given index
  $ ./task done INDEX           # Mark the incomplete item with the given index as complete
  $ ./task help                 # Show usage
  $ ./task report               # Statistics`);
}
else if (args[0] == "add") {
  if (!args[1] || !args[2])
    return console.log("Error: Missing tasks string. Nothing added!");
  append("task.txt", `${args[1]} ${args[2]}`);
  console.log(`Added task: "${args[2]}" with priority ${args[1]}`)
}
else if (args[0] == "ls") {
  const tasks = read("task.txt");
  if (tasks.length <= 0)
    return console.log("There are no pending tasks!");
  tasks.forEach((task, index) => {
    const prior = task[0];
    const item = task.slice(2, task.length);
    console.log(`${index + 1}. ${item} [${prior}]`)
  })
}
else if (args[0] == "done") {
  if (!args[1])
    return console.log("Error: Missing NUMBER for marking tasks as done.");
  const index = args[1] - 1;
  let tasks = read("task.txt");
  if (args[1] > tasks.length)
    return console.log("Error: no incomplete item with index #0 exists.")
  const item = tasks[index].slice(2, tasks[index].length);
  append("completed.txt", item);
  tasks.splice(index, 1);
  tasks = tasks.join("\n");
  if (tasks == "")
    write("task.txt", tasks);
  else
    write("task.txt", tasks + "\n");
  console.log("Marked item as done.")
}
else if (args[0] == "del") {
  if (!args[1])
    return console.log("Error: Missing NUMBER for deleting tasks.");
  const index = args[1] - 1;
  let tasks = read("task.txt");
  if (index + 1 > tasks.length)
    return console.log(`Error: task with index #${index} does not exist. Nothing deleted.`);
  tasks.splice(index, 1);
  tasks = tasks.join("\n");
  if (tasks == "")
    write("task.txt", tasks);
  else
    write("task.txt", tasks + "\n");
  console.log(`Deleted task #${args[1]}`);
}
else if (args[0] == "report") {
  let pendingTasks = read("task.txt");
  console.log(`Pending : ${pendingTasks.length}`);
  pendingTasks.forEach((task, index) => {
    const prior = task[0];
    const item = task.slice(2, task.length);
    console.log(`${index + 1}. ${item} [${prior}]`)
  })
  console.log("\n");
  let completedtask = read("completed.txt");
  console.log(`Completed : ${completedtask.length}`);
  completedtask.forEach((task, index) => {
    console.log(`${index + 1}. ${task}`);
  })
} 
