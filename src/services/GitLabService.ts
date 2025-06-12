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

  async listBranches(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/repository/branches`);
    return data;
  }

  async listCommits(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/repository/commits`);
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
}
