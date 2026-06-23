package com.swp391.horseracing.dto.response;

public class AdminRaceChecklistResponse {
    private boolean hasReferee;
    private int approvedEntries;
    private int approvedWithJockey;
    private int checkedInOrNoShowOrWithdrawn;
    private int resultsRecorded;
    private boolean reportSubmitted;
    private boolean reportConfirmed;

    public boolean isHasReferee() { return hasReferee; }
    public void setHasReferee(boolean hasReferee) { this.hasReferee = hasReferee; }
    public int getApprovedEntries() { return approvedEntries; }
    public void setApprovedEntries(int approvedEntries) { this.approvedEntries = approvedEntries; }
    public int getApprovedWithJockey() { return approvedWithJockey; }
    public void setApprovedWithJockey(int approvedWithJockey) { this.approvedWithJockey = approvedWithJockey; }
    public int getCheckedInOrNoShowOrWithdrawn() { return checkedInOrNoShowOrWithdrawn; }
    public void setCheckedInOrNoShowOrWithdrawn(int checkedInOrNoShowOrWithdrawn) { this.checkedInOrNoShowOrWithdrawn = checkedInOrNoShowOrWithdrawn; }
    public int getResultsRecorded() { return resultsRecorded; }
    public void setResultsRecorded(int resultsRecorded) { this.resultsRecorded = resultsRecorded; }
    public boolean isReportSubmitted() { return reportSubmitted; }
    public void setReportSubmitted(boolean reportSubmitted) { this.reportSubmitted = reportSubmitted; }
    public boolean isReportConfirmed() { return reportConfirmed; }
    public void setReportConfirmed(boolean reportConfirmed) { this.reportConfirmed = reportConfirmed; }
}

