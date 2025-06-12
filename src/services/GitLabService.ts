import axios, { AxiosInstance } from 'axios';

export interface CreateIssueOptions {
  title: string;
  description?: string;
  [key: string]: unknown;
}

export interface IssueResponse {
  id: number;
  title: string;
  description?: string;
  [key: string]: unknown;
}

export class GitLabService {
  private client: AxiosInstance;

  constructor(
    private readonly baseUrl: string = process.env.GITLAB_BASE_URL || '',
    private readonly token: string = process.env.GITLAB_TOKEN || '',
  ) {
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: { 'PRIVATE-TOKEN': this.token },
      proxy: false,
    });
  }

  async listMergeRequests(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/merge_requests`);
    return data;
  }

  async createMergeRequest(projectId: string | number, payload: Record<string, unknown>) {
    const { data } = await this.client.post(`/projects/${projectId}/merge_requests`, payload);
    return data;
  }

  async acceptMergeRequest(projectId: string | number, mrIid: string | number) {
    const { data } = await this.client.put(
      `/projects/${projectId}/merge_requests/${mrIid}/merge`,
    );
    return data;
  }

  async closeMergeRequest(projectId: string | number, mrIid: string | number) {
    const { data } = await this.client.put(
      `/projects/${projectId}/merge_requests/${mrIid}/close`,
    );
    return data;
  }

  async reopenMergeRequest(projectId: string | number, mrIid: string | number) {
    const { data } = await this.client.put(
      `/projects/${projectId}/merge_requests/${mrIid}/reopen`,
    );
    return data;
  }

  async rebaseMergeRequest(projectId: string | number, mrIid: string | number) {
    const { data } = await this.client.put(
      `/projects/${projectId}/merge_requests/${mrIid}/rebase`,
    );
    return data;
  }

  async getMergeRequestChanges(projectId: string | number, mrIid: string | number) {
    const { data } = await this.client.get(
      `/projects/${projectId}/merge_requests/${mrIid}/changes`,
    );
    return data;
  }

  async getMergeRequest(projectId: string | number, mrIid: string | number) {
    const { data } = await this.client.get(
      `/projects/${projectId}/merge_requests/${mrIid}`,
    );
    return data;
  }

  async getProject(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}`);
    return data;
  }

  async listDiscussions(projectId: string | number, mrIid: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/merge_requests/${mrIid}/discussions`);
    return data;
  }

  async getMergeRequestDiscussion(
    projectId: string | number,
    mrIid: string | number,
    discussionId: string,
  ) {
    const { data } = await this.client.get(
      `/projects/${projectId}/merge_requests/${mrIid}/discussions/${discussionId}`,
    );
    return data;
  }

  async addNoteToDiscussion(
    projectId: string | number,
    mrIid: string | number,
    discussionId: string,
    payload: Record<string, unknown>,
  ) {
    const { data } = await this.client.post(
      `/projects/${projectId}/merge_requests/${mrIid}/discussions/${discussionId}/notes`,
      payload,
    );
    return data;
  }

  async createMergeRequestDiscussion(
    projectId: string | number,
    mrIid: string | number,
    payload: Record<string, unknown>,
  ) {
    const { data } = await this.client.post(
      `/projects/${projectId}/merge_requests/${mrIid}/discussions`,
      payload,
    );
    return data;
  }

  async deleteMergeRequestDiscussion(
    projectId: string | number,
    mrIid: string | number,
    discussionId: string,
  ) {
    await this.client.delete(
      `/projects/${projectId}/merge_requests/${mrIid}/discussions/${discussionId}`,
    );
  }

  async updateMergeRequestDiscussion(
    projectId: string | number,
    mrIid: string | number,
    discussionId: string,
    payload: Record<string, unknown>,
  ) {
    const { data } = await this.client.put(
      `/projects/${projectId}/merge_requests/${mrIid}/discussions/${discussionId}`,
      payload,
    );
    return data;
  }

  async resolveDiscussion(
    projectId: string | number,
    mrIid: string | number,
    discussionId: string,
  ) {
    const { data } = await this.client.put(
      `/projects/${projectId}/merge_requests/${mrIid}/discussions/${discussionId}/resolve`,
    );
    return data;
  }

  async listBranches(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/repository/branches`);
    return data;
  }

  async listCommits(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/repository/commits`);
    return data;
  }

  async listPipelines(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/pipelines`);
    return data;
  }

  async getPipeline(projectId: string | number, pipelineId: string | number) {
    const { data } = await this.client.get(
      `/projects/${projectId}/pipelines/${pipelineId}`,
    );
    return data;
  }

  async listIssues(projectId: string | number): Promise<IssueResponse[]> {
    const { data } = await this.client.get(`/projects/${projectId}/issues`);
    return data;
  }

  async createIssue(
    projectId: string | number,
    payload: CreateIssueOptions,
  ): Promise<IssueResponse> {
    const { data } = await this.client.post(
      `/projects/${projectId}/issues`,
      payload,
    );
    return data;
  }

  async getFile(projectId: string | number, filePath: string, ref: string) {
    const encodedPath = encodeURIComponent(filePath);
    const { data } = await this.client.get(
      `/projects/${projectId}/repository/files/${encodedPath}/raw`,
      { params: { ref }, responseType: 'text' },
    );
    return data as string;
  }

  async getMergeRequestNote(
    projectId: string | number,
    mrIid: string | number,
    noteId: string | number,
  ) {
    const { data } = await this.client.get(
      `/projects/${projectId}/merge_requests/${mrIid}/notes/${noteId}`,
    );
    return data;
  }

  async createMergeRequestNote(
    projectId: string | number,
    mrIid: string | number,
    payload: Record<string, unknown>,
  ) {
    const { data } = await this.client.post(
      `/projects/${projectId}/merge_requests/${mrIid}/notes`,
      payload,
    );
    return data;
  }

  async updateMergeRequestNote(
    projectId: string | number,
    mrIid: string | number,
    noteId: string | number,
    payload: Record<string, unknown>,
  ) {
    const { data } = await this.client.put(
      `/projects/${projectId}/merge_requests/${mrIid}/notes/${noteId}`,
      payload,
    );
    return data;
  }

  async deleteMergeRequestNote(
    projectId: string | number,
    mrIid: string | number,
    noteId: string | number,
  ) {
    await this.client.delete(
      `/projects/${projectId}/merge_requests/${mrIid}/notes/${noteId}`,
    );
  }

  async setMergeRequestLabels(
    projectId: string | number,
    mrIid: string | number,
    payload: Record<string, unknown>,
  ) {
    const { data } = await this.client.put(
      `/projects/${projectId}/merge_requests/${mrIid}`,
      payload,
    );
    return data;
  }
}
