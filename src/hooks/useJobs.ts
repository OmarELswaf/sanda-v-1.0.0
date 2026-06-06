import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsApi, JobFilters } from "@/api/jobs";

export const useJobs = (filters: JobFilters = {}) =>
  useQuery({ queryKey: ["jobs", filters], queryFn: () => jobsApi.list(filters) });

export const useJob = (id: string) =>
  useQuery({ queryKey: ["jobs", id], queryFn: () => jobsApi.get(id), enabled: !!id });

export const useMyJobs = () =>
  useQuery({ queryKey: ["jobs", "mine"], queryFn: () => jobsApi.myJobs() });

export const useApplicants = (jobId: string) =>
  useQuery({ queryKey: ["applicants", jobId], queryFn: () => jobsApi.applicants(jobId), enabled: !!jobId });

export const useRatings = (userId: string) =>
  useQuery({ queryKey: ["ratings", userId], queryFn: () => jobsApi.ratings(userId), enabled: !!userId });

export const useCreateJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: jobsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
};

export const useApplyToJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, message }: { jobId: string; message: string }) => jobsApi.apply(jobId, message),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
};

export const useAcceptApplicant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: string) => jobsApi.acceptApplicant(applicationId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applicants"] }),
  });
};

export const useRejectApplicant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: string) => jobsApi.rejectApplicant(applicationId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applicants"] }),
  });
};
