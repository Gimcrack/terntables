@extends('partials.metrics.tickets')

@section('body')
    <div class="col-xs-12">
        <div class="panel panel-success">
            <div class="panel-heading">
                <strong class="visible-md visible-lg">Tickets By Month Opened - Last {{ $years ?: 5 }} Years : {{$id ?: "IT Department"}}</strong>
                <strong class="visible-sm">Tickets By Month Opened : {{$id ?: "IT Department"}}</strong>
                <strong class="visible-xs">Tickets By Month Opened : {{$id ?: "IT Department"}}</strong>
            </div>
            <div class="panel-body">
                @include('partials.preloader')
                <div id="closed-tickets-by-month"></div>
            </div>
        </div>
    </div>
    <div class="col-xs-4">
        <div class="panel panel-info">
            <div class="panel-heading">
                <strong class="visible-md visible-lg">Hours Worked By Customer (Top 10) - Last {{ $years ?: 5 }} Years : {{$id ?: "IT Department"}}</strong>
                <strong class="visible-sm">Hours By Customer : {{$id ?: "IT Department"}}</strong>
                <strong class="visible-xs">Hours By Customer : {{$id ?: "IT Department"}}</strong>
            </div>
            <div class="panel-body">
                @include('partials.preloader')
                <div id="hours-by-customer"></div>
            </div>
        </div>
    </div>

    <div class="col-xs-4">
        <div class="panel panel-info">
            <div class="panel-heading">
                <strong class="visible-md visible-lg">Tickets By Customer (Top 10) - Last {{ $years ?: 5 }} Years : {{$id ?: "IT Department"}}</strong>
                <strong class="visible-sm">Tickets By Customer : {{$id ?: "IT Department"}}</strong>
                <strong class="visible-xs">Tickets By Customer : {{$id ?: "IT Department"}}</strong>
            </div>
            <div class="panel-body">
                @include('partials.preloader')
                <div id="tickets-by-customer"></div>
            </div>
        </div>
    </div>

    <div class="col-xs-4">
        <div class="panel panel-info">
            <div class="panel-heading">
                <strong class="visible-md visible-lg">Tickets By Days Open - Last {{ $years ?: 5 }} Years : {{$id ?: "IT Department"}}</strong>
                <strong class="visible-sm">Tickets By Days Open : {{$id ?: "IT Department"}}</strong>
                <strong class="visible-xs">Tickets By Days Open : {{$id ?: "IT Department"}}</strong>
            </div>
            <div class="panel-body">
                @include('partials.preloader')
                <div id="tickets-by-days-open"></div>
            </div>
        </div>
    </div>

    <div class="col-xs-12">
        <div class="panel panel-warning">
            <div class="panel-heading">
                <strong class="visible-md visible-lg">Number of Tickets By Category - (Top 10) - Last {{ $years ?: 5 }} Years : {{$id ?: "IT Department"}}</strong>
                <strong class="visible-sm">Tickets By Category : {{$id ?: "IT Department"}}</strong>
                <strong class="visible-xs">Tickets By Category : {{$id ?: "IT Department"}}</strong>
            </div>
            <div class="panel-body">
                @include('partials.preloader')
                <div id="tickets-by-category"></div>
            </div>
        </div>
    </div>

    <div class="col-xs-12">
        <div class="panel panel-primary">
            <div class="panel-heading">
                <strong class="visible-md visible-lg">Hours Worked By Category - (Top 10) - Last {{ $years ?: 5 }} Years : {{$id ?: "IT Department"}}</strong>
                <strong class="visible-sm">Hours By Category : {{$id ?: "IT Department"}}</strong>
                <strong class="visible-xs">Hours By Category : {{$id ?: "IT Department"}}</strong>
            </div>
            <div class="panel-body">
                @include('partials.preloader')
                <div id="hours-by-category"></div>
            </div>
        </div>
    </div>
    

<script type="text/javascript">
    ticketTrends([
    	'{{$groupOrIndividual}}',
    	'{{$id}}',
    	{{$years}}
    ]);
</script>

@endsection
