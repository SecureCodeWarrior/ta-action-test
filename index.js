const core = require('@actions/core');
const github = require('@actions/github');

try {
    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
    
    // Create an authenticated Octokit instance
    const token = core.getInput('github-token'); // Ensure 'github-token' is passed as an input
    const octokit = github.getOctokit(token);

    // Post a comment on a pull request
    const prNumber = github.context.payload.pull_request?.number;
    if (!prNumber) {
        throw new Error('This action can only run on pull request events.');
    }

    const commentBody = 'Hello! This is a comment from your GitHub Action.';
    octokit.rest.issues.createComment({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: prNumber,
        body: commentBody,
    }).then(() => {
        console.log('Comment posted successfully!');
    }).catch((error) => {
        console.error('Error posting comment:', error);
    });

    // core.setFailed("FAIL");
    // return 78;
} catch (error) {
    core.setFailed(error.message);
}
