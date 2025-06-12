import axios, { AxiosInstance } from 'axios';

export class GitLabService {
  private client: AxiosInstance;

  constructor(
    private readonly baseUrl: string = process.env.GITLAB_BASE_URL || '',
    private readonly token: string = process.env.GITLAB_TOKEN || '',
  ) {
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: { 'PRIVATE-TOKEN': this.token },
    });
  }

  async listMergeRequests(projectId: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/merge_requests`);
    return data;
  }

  async listDiscussions(projectId: string | number, mrIid: string | number) {
    const { data } = await this.client.get(`/projects/${projectId}/merge_requests/${mrIid}/discussions`);
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
