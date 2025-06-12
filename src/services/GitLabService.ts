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

  async listProjects(params: Record<string, unknown> = {}) {
    const { data } = await this.client.get('/projects', { params });
    return data;
  }

  async searchProjects(query: string) {
    return this.listProjects({ search: query });
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

  async unresolveDiscussion(
    projectId: string | number,
    mrIid: string | number,
    discussionId: string,
  ) {
    const { data } = await this.client.put(
      `/projects/${projectId}/merge_requests/${mrIid}/discussions/${discussionId}/unresolve`,
    );
    return data;
  }

  async listBranches(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/repository/branches`);
    return data;
  }

  async getBranch(projectId: string | number, branch: string) {
    const encoded = encodeURIComponent(branch);
    const { data } = await this.client.get(
      `/projects/${projectId}/repository/branches/${encoded}`,
    );
    return data;
  }

  async createBranch(
    projectId: string | number,
    payload: { branch: string; ref: string },
  ) {
    const { data } = await this.client.post(
      `/projects/${projectId}/repository/branches`,
      payload,
    );
    return data;
  }

  async deleteBranch(projectId: string | number, branch: string) {
    const encoded = encodeURIComponent(branch);
    await this.client.delete(
      `/projects/${projectId}/repository/branches/${encoded}`,
    );
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

  async createPipeline(
    projectId: string | number,
    payload: Record<string, unknown>,
  ) {
    const { data } = await this.client.post(
      `/projects/${projectId}/pipelines`,
      payload,
    );
    return data;
  }

  async cancelPipeline(projectId: string | number, pipelineId: string | number) {
    const { data } = await this.client.post(
      `/projects/${projectId}/pipelines/${pipelineId}/cancel`,
    );
    return data;
  }

  async retryPipeline(projectId: string | number, pipelineId: string | number) {
    const { data } = await this.client.post(
      `/projects/${projectId}/pipelines/${pipelineId}/retry`,
    );
    return data;
  }

  async deletePipeline(projectId: string | number, pipelineId: string | number) {
    await this.client.delete(
      `/projects/${projectId}/pipelines/${pipelineId}`,
    );
  }

  async getPipelineJobs(projectId: string | number, pipelineId: string | number) {
    const { data } = await this.client.get(
      `/projects/${projectId}/pipelines/${pipelineId}/jobs`,
    );
    return data;
  }

  async downloadPipelineArtifacts(
    projectId: string | number,
    pipelineId: string | number,
  ) {
    const { data } = await this.client.get(
      `/projects/${projectId}/pipelines/${pipelineId}/artifacts`,
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

  async getIssue(
    projectId: string | number,
    issueIid: string | number,
  ): Promise<IssueResponse> {
    const { data } = await this.client.get(
      `/projects/${projectId}/issues/${issueIid}`,
    );
    return data;
  }

  async updateIssue(
    projectId: string | number,
    issueIid: string | number,
    payload: Record<string, unknown>,
  ): Promise<IssueResponse> {
    const { data } = await this.client.put(
      `/projects/${projectId}/issues/${issueIid}`,
      payload,
    );
    return data;
  }

  async closeIssue(projectId: string | number, issueIid: string | number) {
    const { data } = await this.client.put(
      `/projects/${projectId}/issues/${issueIid}`,
      { state_event: 'close' },
    );
    return data;
  }

  async reopenIssue(projectId: string | number, issueIid: string | number) {
    const { data } = await this.client.put(
      `/projects/${projectId}/issues/${issueIid}`,
      { state_event: 'reopen' },
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

  async createFile(
    projectId: string | number,
    filePath: string,
    payload: Record<string, unknown>,
  ) {
    const encodedPath = encodeURIComponent(filePath);
    const { data } = await this.client.post(
      `/projects/${projectId}/repository/files/${encodedPath}`,
      payload,
    );
    return data;
  }

  async updateFile(
    projectId: string | number,
    filePath: string,
    payload: Record<string, unknown>,
  ) {
    const encodedPath = encodeURIComponent(filePath);
    const { data } = await this.client.put(
      `/projects/${projectId}/repository/files/${encodedPath}`,
      payload,
    );
    return data;
  }

  async deleteFile(
    projectId: string | number,
    filePath: string,
    params: Record<string, unknown>,
  ) {
    const encodedPath = encodeURIComponent(filePath);
    await this.client.delete(
      `/projects/${projectId}/repository/files/${encodedPath}`,
      { params },
    );
  }

  async listFiles(
    projectId: string | number,
    params: Record<string, unknown>,
  ) {
    const { data } = await this.client.get(
      `/projects/${projectId}/repository/tree`,
      { params },
    );
    return data;
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

  async createGroup(payload: Record<string, unknown>) {
    const { data } = await this.client.post('/groups', payload);
    return data;
  }

  async getGroup(groupId: string | number) {
    const { data } = await this.client.get(`/groups/${groupId}`);
    return data;
  }

  async deleteGroup(groupId: string | number) {
    const { data } = await this.client.delete(`/groups/${groupId}`);
    return data;
  }

  async listGroupMembers(groupId: string | number) {
    const { data } = await this.client.get(`/groups/${groupId}/members`);
    return data;
  }

  async listReleases(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/releases`);
    return data;
  }

  async getRelease(projectId: string | number, tagName: string) {
    const encoded = encodeURIComponent(tagName);
    const { data } = await this.client.get(`/projects/${projectId}/releases/${encoded}`);
    return data;
  }

  async createRelease(projectId: string | number, payload: Record<string, unknown>) {
    const { data } = await this.client.post(`/projects/${projectId}/releases`, payload);
    return data;
  }

  async updateRelease(projectId: string | number, tagName: string, payload: Record<string, unknown>) {
    const encoded = encodeURIComponent(tagName);
    const { data } = await this.client.put(`/projects/${projectId}/releases/${encoded}`, payload);
    return data;
  }

  async deleteRelease(projectId: string | number, tagName: string) {
    const encoded = encodeURIComponent(tagName);
    await this.client.delete(`/projects/${projectId}/releases/${encoded}`);
  }

  async listTags(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/repository/tags`);
    return data;
  }

  async getTag(projectId: string | number, tagName: string) {
    const encoded = encodeURIComponent(tagName);
    const { data } = await this.client.get(`/projects/${projectId}/repository/tags/${encoded}`);
    return data;
  }

  async createTag(projectId: string | number, payload: Record<string, unknown>) {
    const { data } = await this.client.post(`/projects/${projectId}/repository/tags`, payload);
    return data;
  }

  async deleteTag(projectId: string | number, tagName: string) {
    const encoded = encodeURIComponent(tagName);
    await this.client.delete(`/projects/${projectId}/repository/tags/${encoded}`);
  }
  async listProjectAccessTokens(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/access_tokens`);
    return data;
  }

  async listProjectAccessRequests(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/access_requests`);
    return data;
  }

  async listGroupAccessTokens(groupId: string | number) {
    const { data } = await this.client.get(`/groups/${groupId}/access_tokens`);
    return data;
  }

  async listGroupAccessRequests(groupId: string | number) {
    const { data } = await this.client.get(`/groups/${groupId}/access_requests`);
    return data;
  }

  async listGroupEpics(groupId: string | number) {
    const { data } = await this.client.get(`/groups/${groupId}/epics`);
    return data;
  }
  async listDeployKeys(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/deploy_keys`);
    return data;
  }

  async createDeployToken(projectId: string | number, payload: Record<string, unknown>) {
    const { data } = await this.client.post(`/projects/${projectId}/deploy_tokens`, payload);
    return data;
  }

  async listDeployments(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/deployments`);
    return data;
  }
  async listRegistryRepositories(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/registry/repositories`);
    return data;
  }

  async listRegistryProtectionRules(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/registry/protection/repository/rules`);
    return data;
  }
  async createFeatureFlag(projectId: string | number, payload: Record<string, unknown>) {
    const { data } = await this.client.post(`/projects/${projectId}/feature_flags`, payload);
    return data;
  }

  async listFeatureFlags(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/feature_flags`);
    return data;
  }

  async deleteFeatureFlag(projectId: string | number, flagId: string | number) {
    await this.client.delete(`/projects/${projectId}/feature_flags/${flagId}`);
  }

  async listFreezePeriods(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/freeze_periods`);
    return data;
  }
  async createProjectVariable(projectId: string | number, payload: Record<string, unknown>) {
    const { data } = await this.client.post(`/projects/${projectId}/variables`, payload);
    return data;
  }

  async listProjectVariables(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/variables`);
    return data;
  }

  async deleteProjectVariable(projectId: string | number, key: string) {
    const encoded = encodeURIComponent(key);
    await this.client.delete(`/projects/${projectId}/variables/${encoded}`);
  }

  async listProtectedBranches(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/protected_branches`);
    return data;
  }

  async listPersonalAccessTokens() {
    const { data } = await this.client.get(`/personal_access_tokens`);
    return data;
  }

  async graphqlQuery(query: Record<string, unknown>) {
    const { data } = await this.client.post(`/graphql`, query);
    return data;
  }
}
