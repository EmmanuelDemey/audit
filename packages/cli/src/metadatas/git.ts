import {GitMetadata} from "../types";
import simpleGit, { SimpleGit } from 'simple-git';
import path from "path";
import { v4 as uuidv4 } from 'uuid';

export const clone = async (remote: string) => {
    const folder = uuidv4();
    const gitClient: SimpleGit = simpleGit({
        baseDir: path.resolve("./.git_repo")
    });
    await gitClient.clone(remote, folder);
    return "./.git_repo/" + folder;
}
export const getGitMetadata = async (baseDir: string) => {
    const gitClient: SimpleGit = simpleGit({
        baseDir: baseDir
    });

    const git: GitMetadata = {};
    const remotes = await gitClient.getRemotes(true);
    git.remotes = remotes;

    return git;
}
