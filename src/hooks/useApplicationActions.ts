// hooks/useApplicationActions.ts

import { useState } from 'react'
import {
  useQueryClient,
  useMutation,
  type UseMutationResult,
} from 'react-query'
import {
  postApplicationTrigger,
  postApplicationProposal,
  postApplicationApproval,
} from '@/lib/apiClient'
import { type Application } from '@/type'

interface ApplicationActions {
  application: Application
  isApiCalling: boolean
  setApiCalling: React.Dispatch<React.SetStateAction<boolean>>
  mutationTrigger: UseMutationResult<
    Application | undefined,
    unknown,
    string,
    unknown
  >
  mutationProposal: UseMutationResult<
    Application | undefined,
    unknown,
    string,
    unknown
  >
  mutationApproval: UseMutationResult<
    Application | undefined,
    unknown,
    string,
    unknown
  >
}

/**
 * Custom hook to manage application actions and its respective states.
 * Provides mutation functions to interact with the API based on application ID.
 * Manages the state of the current application data, as well as any ongoing API calls.
 *
 * @function
 * @param {Application} initialApplication - The initial application data.
 * @returns {ApplicationActions} - An object containing the current application, its API call state, and mutation functions.
 */
const useApplicationActions = (
  initialApplication: Application,
): ApplicationActions => {
  const queryClient = useQueryClient()
  const [isApiCalling, setApiCalling] = useState(false)
  const [application, setApplication] =
    useState<Application>(initialApplication)

  /**
   * Updates the application cache with the latest data from the API.
   * Updates both the local application state and the react-query cache.
   *
   * @function
   * @param {Application|null} apiResponse - The latest application data from the API.
   */
  const updateCache = (apiResponse: Application | null): void => {
    if (apiResponse == null) return
    setApplication(apiResponse)

    queryClient.setQueryData(
      ['application'],
      (oldData: Application[] | undefined) => {
        if (oldData == null) return []
        const indexToUpdate = oldData?.findIndex(
          (app) => app.id === apiResponse?.id,
        )
        if (apiResponse != null && indexToUpdate !== -1) {
          oldData[indexToUpdate] = apiResponse
        }
        return [...oldData]
      },
    )

    queryClient.setQueryData(['posts', initialApplication.id], () => {
      return apiResponse
    })
  }

  /**
   * Mutation function to handle the triggering of an application.
   * It makes an API call to trigger the application and updates the cache on success.
   *
   * @function
   * @param {string} userName - The user's name.
   * @returns {Promise<void>} - A promise that resolves when the mutation is completed.
   */
  const mutationTrigger = useMutation<
    Application | undefined,
    unknown,
    string,
    unknown
  >(
    async (userName: string) =>
      await postApplicationTrigger(initialApplication.id, userName),
    {
      onSuccess: (data) => {
        setApiCalling(false)
        if (data != null) updateCache(data)
      },
      onError: () => {
        setApiCalling(false)
      },
    },
  )

  /**
   * Mutation function to handle the proposal of an application.
   * It makes an API call to propose the application and updates the cache on success.
   *
   * @function
   * @param {string} requestId - The request ID associated with the proposal.
   * @returns {Promise<void>} - A promise that resolves when the mutation is completed.
   */
  const mutationProposal = useMutation<
    Application | undefined,
    unknown,
    string,
    unknown
  >(
    async (requestId: string) =>
      await postApplicationProposal(initialApplication.id, requestId),
    {
      onSuccess: (data) => {
        setApiCalling(false)
        if (data != null) updateCache(data)
      },
      onError: () => {
        setApiCalling(false)
      },
    },
  )

  /**
   * Mutation function to handle the approval of an application.
   * It makes an API call to approve the application and updates the cache on success.
   *
   * @function
   * @param {string} requestId - The request ID associated with the approval.
   * @returns {Promise<void>} - A promise that resolves when the mutation is completed.
   */
  const mutationApproval = useMutation<
    Application | undefined,
    unknown,
    string,
    unknown
  >(
    async (requestId: string) =>
      await postApplicationApproval(initialApplication.id, requestId),
    {
      onSuccess: (data) => {
        setApiCalling(false)
        if (data != null) updateCache(data)
      },
      onError: () => {
        setApiCalling(false)
      },
    },
  )

  return {
    application,
    isApiCalling,
    setApiCalling,
    mutationTrigger,
    mutationProposal,
    mutationApproval,
  }
}

export default useApplicationActions
